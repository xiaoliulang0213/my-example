package com.bestvike.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by lihua on 2017/2/21.
 */
@Controller
public class IndexController {
    @RequestMapping("/h5")
    public String h5Index() {
        return "/h5/index.html";
    }
    @RequestMapping("/h5/example")
    public String h5ExampleIndex() {
        return "/h5/example/index.html";
    }

    @RequestMapping("/pc")
    public String pcIndex() {
        return "/pc/index.html";
    }
}
