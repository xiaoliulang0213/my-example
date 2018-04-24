package com.bestvike.tools.controller;

import com.bestvike.commons.support.FileDetail;
import com.bestvike.pub.controller.BaseController;
import com.bestvike.tools.service.PunchService;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/punch")
public class PunchController extends BaseController {
    @Autowired
    private PunchService punchService;

    public PunchController() {
        super("11");
    }

    @RequestMapping(value = "/import", method = RequestMethod.POST)
    public Map<String, Object> imports(@RequestBody FileDetail fileDetail) throws IOException, InvalidFormatException, SAXException {
        return punchService.imports(fileDetail);
    }
}
