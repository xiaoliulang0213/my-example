package com.bestvike.tools.service;

import com.bestvike.commons.support.FileDetail;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Map;

/**
 * Created by lihua on 2016/8/30.
 */
@Service
public interface PunchService {
    public Map<String, Object> imports(FileDetail fileDetail) throws IOException, InvalidFormatException, SAXException;
}
