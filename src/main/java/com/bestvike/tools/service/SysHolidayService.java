package com.bestvike.tools.service;

import com.bestvike.tools.data.SysHoliday;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface SysHolidayService {
    public Map<String, String> cacheAll();
    public int init(SysHoliday sysHoliday);
}
