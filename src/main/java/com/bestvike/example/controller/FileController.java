package com.bestvike.example.controller;

import com.bestvike.commons.util.FileUtil;
import com.bestvike.example.data.LogFile;
import com.bestvike.example.service.FileService;
import com.bestvike.pub.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

/**
 * Created by lihua on 2016/9/30.
 */
@RestController
@RequestMapping("/api/file")
public class FileController extends BaseController {
    @Autowired
    private FileService fileService;

    public FileController() {
        super("91");
    }

    @RequestMapping(value="/upload", method = RequestMethod.POST)
    public LogFile upload(@RequestParam(name = "name") String name, @RequestParam(name = "fileType", required = false) String fileType, @RequestParam(name = "subType", required = false) String subType,
                          @RequestParam(name = "keyId", required = false) String keyId, @RequestParam(name = "fileSource", required = false) String fileSource, HttpServletRequest httpServletRequest) throws IOException {
        return fileService.upload(httpServletRequest.getInputStream(), name, fileType, subType, keyId, fileSource, super.getUserIdAndName());
    }

    @RequestMapping(value="/formUpload", method = RequestMethod.POST)
    public LogFile formUpload(@RequestParam MultipartFile file) throws IOException {
        return fileService.upload(file.getInputStream(), file.getName(), null, null, null, null, super.getUserIdAndName());
    }

    @RequestMapping(value="/download", method = RequestMethod.GET)
    public void download1(HttpServletRequest request, HttpServletResponse response, @RequestParam("fileName") String fileName,
                         @RequestParam(name = "originName", required = false) String originName) throws IOException {
        // FileUtil.download(request, response, fileName, originName);
        if (!StringUtils.isEmpty(originName)) {
            FileUtil.download(request, response, fileName, originName);
        } else {
            FileUtil.download(request, response, fileName);
        }
    }

    @RequestMapping(value="/template", method = RequestMethod.GET)
    public void template(HttpServletRequest request, HttpServletResponse response, String fileName) throws IOException {
        FileUtil.download(request, response, FileUtil.getInputStream(templatePath + File.separator + fileName), fileName);
    }

    @RequestMapping(value="/{fileSign}", method = RequestMethod.GET)
    public void download2(HttpServletRequest request, HttpServletResponse response, @PathVariable("fileSign") String fileSign,
                         @RequestParam(name = "name", required = false) String name) throws IOException {
        if (!StringUtils.isEmpty(fileSign)) {
            LogFile logFile = fileService.selectBySign(fileSign);
            if (logFile != null) {
                if (StringUtils.isEmpty(name)) {
                    name = logFile.getOriginName();
                }
                FileUtil.download(request, response, logFile.getFilePath() + logFile.getFileName(), name);
            }
        }
    }
}
