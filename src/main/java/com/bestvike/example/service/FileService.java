package com.bestvike.example.service;

import com.bestvike.example.data.LogFile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created by lihua on 2016/10/1.
 */
@Service
public interface FileService {
    public LogFile upload(InputStream inputStream, String name, String fileType, String subType, String keyId, String fileSource, String userIdAndName) throws IOException;
    public LogFile selectBySign(String sign);
    public int deleteBySign(String sign);
}
