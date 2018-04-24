package com.bestvike.pub.controller;

import com.bestvike.commons.controller.AbstractController;
import org.springframework.beans.factory.annotation.Value;

/**
 * Created by lihua on 2016/8/27.
 */
public class BaseController extends AbstractController {
    @Value("${app.file.templatePath}")
    protected String templatePath;

    public BaseController(String moduleNo) {
        super(moduleNo);
    }
}
