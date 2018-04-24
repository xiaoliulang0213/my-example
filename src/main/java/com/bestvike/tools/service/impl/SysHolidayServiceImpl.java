package com.bestvike.tools.service.impl;

import com.bestvike.commons.util.DateUtil;
import com.bestvike.pub.service.BaseService;
import com.bestvike.tools.dao.SysHolidayDao;
import com.bestvike.tools.data.SysHoliday;
import com.bestvike.tools.service.SysHolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
public class SysHolidayServiceImpl extends BaseService implements SysHolidayService {
    @Autowired
    private SysHolidayDao sysHolidayDao;

    @Override
    public Map<String, String> cacheAll() {
        Map<String, String> sysHolidayMap = new HashMap<>();
        List<SysHoliday> sysHolidayList = sysHolidayDao.selectAll();
        if (sysHolidayList != null && sysHolidayList.size() > 0) {
            for (SysHoliday sysHoliday : sysHolidayList) {
                sysHolidayMap.put(sysHoliday.getConfigDate(), sysHoliday.getHolidayType());
            }
        }
        return sysHolidayMap;
    }

    @Override
    @Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public int init(SysHoliday sysHoliday) {
        if (sysHoliday != null) {
            String holidayType = sysHoliday.getHolidayType();
            if (!StringUtils.isEmpty(holidayType) && !StringUtils.isEmpty(sysHoliday.getConfigDateStart()) && !StringUtils.isEmpty(sysHoliday.getConfigDateEnd())) {
                // 正常工作日及周末初始化，只能执行一次
                List<String> dateList = DateUtil.getDates(sysHoliday.getConfigDateStart(), sysHoliday.getConfigDateEnd(), "yyyy-MM-dd");
                if (dateList != null) {
                    if (holidayType.equals("normal")) {
                        for (String date : dateList) {
                            if (sysHolidayDao.selectByPrimaryKey(date) == null) {
                                SysHoliday sysHolidayInfoInsert = new SysHoliday();
                                sysHolidayInfoInsert.setConfigDate(date);
                                int week = DateUtil.getWeek(date, "yyyy-MM-dd");
                                if (week >= 6) {
                                    // 周末
                                    sysHolidayInfoInsert.setHolidayType("weekend");
                                } else {
                                    // 工作日
                                    sysHolidayInfoInsert.setHolidayType("normal");
                                }
                                sysHolidayDao.insert(sysHolidayInfoInsert);
                            }
                        }
                    } else if (holidayType.equals("holiday")) {
                        // 法定节假日
                        for (String date : dateList) {
                            SysHoliday sysHolidayInfoUpdate = new SysHoliday();
                            sysHolidayInfoUpdate.setConfigDate(date);
                            sysHolidayInfoUpdate.setHolidayType("holiday");
                            sysHolidayInfoUpdate.setHolidayName(sysHoliday.getHolidayName());
                            if (sysHolidayDao.selectByPrimaryKey(date) == null) {
                                sysHolidayDao.insert(sysHolidayInfoUpdate);
                            } else {
                                sysHolidayDao.updateByPrimaryKey(sysHolidayInfoUpdate);
                            }
                        }
                    } else if (holidayType.equals("swap")) {
                        // 周末上班
                        for (String date : dateList) {
                            SysHoliday sysHolidayInfoUpdate = new SysHoliday();
                            sysHolidayInfoUpdate.setConfigDate(date);
                            sysHolidayInfoUpdate.setHolidayType("swap");
                            sysHolidayInfoUpdate.setHolidayName(sysHoliday.getHolidayName());
                            if (sysHolidayDao.selectByPrimaryKey(date) == null) {
                                sysHolidayDao.insert(sysHolidayInfoUpdate);
                            } else {
                                sysHolidayDao.updateByPrimaryKey(sysHolidayInfoUpdate);
                            }
                        }
                    }
                }
            }
        }
        return 0;
    }
}
