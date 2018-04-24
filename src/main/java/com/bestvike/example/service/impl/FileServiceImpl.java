package com.bestvike.example.service.impl;

import com.bestvike.commons.util.DateUtil;
import com.bestvike.commons.util.FileUtil;
import com.bestvike.commons.util.StringUtil;
import com.bestvike.example.dao.LogFileDao;
import com.bestvike.example.data.LogFile;
import com.bestvike.example.service.FileService;
import com.bestvike.pub.service.BaseService;
import org.apache.commons.codec.digest.DigestUtils;
import org.mybatis.mapper.entity.Example;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Created by lihua on 2016/10/1.
 */
@Service
@Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
public class FileServiceImpl extends BaseService implements FileService {
    @Value("${app.file.uploadPath:}")
    private String uploadPath;

    @Autowired
    private LogFileDao logFileDao;

    @Override
    @Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public LogFile upload(InputStream inputStream, String name, String fileType, String subType, String keyId, String fileSource, String userIdAndName) throws IOException {
        // TODO: inputStream不能多次读取，因此先读出来
        // TODO: 下一步考虑是否从文件内容获取文件类型，而不是根据文件名
        byte[] bytes = FileUtil.read(inputStream);
        int fileSize = bytes.length;

        String md5 = DigestUtils.md5Hex(bytes);
        String sha1 = DigestUtils.sha1Hex(bytes);
        Example example = new Example(LogFile.class);
        example.createCriteria().andEqualTo("fileMd5", md5);
        List<LogFile> list = logFileDao.selectByExample(example);
        String sign = md5;
        if (list != null && list.size() == 1) {
            // 存在md5相同的记录，需要判断sign
            LogFile savedFile = list.get(0);
            if (savedFile.getFileSha1() != null && savedFile.getFileSha1().equals(sha1) && savedFile.getFileSize() != null && savedFile.getFileSize() == fileSize) {
                savedFile.setFilePath("******");
                return savedFile;
            }
            sign = md5 + sha1 + DigestUtils.md5Hex(String.valueOf(fileSize));
        }

        String extName = name.substring(name.lastIndexOf(".") + 1);
        String fileName = StringUtil.guid() + "." + extName;
        String filePath = FileUtil.filePath(uploadPath);

        // inputStream上面读取后，不能直接用
        FileUtil.save(bytes, new FileOutputStream(filePath + fileName));

        LogFile logFile = new LogFile();
        logFile.setFileId(StringUtil.guid());
        logFile.setFileType(fileType);
        logFile.setSubType(subType);
        logFile.setKeyId(keyId);
        logFile.setFileName(fileName);
        logFile.setOriginName(name);
        logFile.setFilePath(filePath);
        // fileDescribe
        logFile.setExtName(extName);
        // extType
        logFile.setFileSize(fileSize);
        // thumbName
        logFile.setImageWidth(0);
        logFile.setImageHeight(0);
        logFile.setFileMd5(md5);
        logFile.setFileSha1(sha1);
        logFile.setFileSign(sign);
        logFile.setFileSource(fileSource);
        // deleteTime
        // deleteUser
        logFile.setFileState("0000");
        // areaCode
        // appCode
        logFile.setManageTime(DateUtil.getDateDate());
        logFile.setManageUser(userIdAndName);

        logFileDao.insert(logFile);

        // 隐藏文件路径
        logFile.setFilePath("******");

        return logFile;
    }

    @Override
    public LogFile selectBySign(String sign) {
        Example example = new Example(LogFile.class);
        example.createCriteria().andEqualTo("fileSign", sign);
        List<LogFile> list = logFileDao.selectByExample(example);
        if (list != null && list.size() == 1) {
            return list.get(0);
        }
        return null;
    }

    @Override
    public int deleteBySign(String sign) {
        Example example = new Example(LogFile.class);
        example.createCriteria().andEqualTo("fileSign", sign);
        return logFileDao.deleteByExample(example);
    }
}
