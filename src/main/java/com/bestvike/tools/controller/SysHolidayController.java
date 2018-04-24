package com.bestvike.tools.controller;

import com.bestvike.pub.controller.BaseController;
import com.bestvike.tools.data.SysHoliday;
import com.bestvike.tools.service.SysHolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/holiday")
public class SysHolidayController extends BaseController {
    @Autowired
    private SysHolidayService sysHolidayService;

    public SysHolidayController() {
        super("11");
    }

    @RequestMapping(value = "/init", method = RequestMethod.POST)
    public void init(@RequestBody SysHoliday sysHoliday) {
        sysHolidayService.init(sysHoliday);
    }
}
