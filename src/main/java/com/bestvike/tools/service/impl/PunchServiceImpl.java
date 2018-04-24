package com.bestvike.tools.service.impl;

import com.bestvike.commons.support.FileDetail;
import com.bestvike.commons.util.DateUtil;
import com.bestvike.commons.util.ExcelUtil;
import com.bestvike.commons.util.StringUtil;
import com.bestvike.pub.config.AppGlobal;
import com.bestvike.pub.service.BaseService;
import com.bestvike.tools.entity.PunchDetail;
import com.bestvike.tools.entity.PunchExcel;
import com.bestvike.tools.service.PunchService;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.xml.sax.SAXException;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihua on 2016/8/30.
 */
@Service
@Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
public class PunchServiceImpl extends BaseService implements PunchService {
    @Value("${app.file.templatePath}")
    protected String templatePath;

    @Override
    public Map<String, Object> imports(FileDetail fileDetail) throws IOException, InvalidFormatException, SAXException {
        Map<String, Object> varMap = new HashMap<>();
        Map<String, Object> punchMap = new HashMap<>();
        List<PunchExcel> punchExcelList = new ArrayList<>();
        varMap.put("punchMap", punchMap);
        varMap.put("punchExcelList", punchExcelList);

        ExcelUtil.importFile(templatePath, "punchImport.xml", new FileInputStream(fileDetail.getFilePath() + fileDetail.getFileName()), varMap);

        String punchPeriod = (String) punchMap.get("punchPeriod");
        String punchYear = "";
        String punchMonth = "";
        if (!StringUtils.isEmpty(punchPeriod) && punchPeriod.length() >= 8) {
            String[] periods = punchPeriod.split("/");
            if (periods.length >= 2) {
                punchYear = periods[0];
                punchMonth = periods[1];
                if (punchMonth.length() == 1) {
                    punchMonth = "0" + punchMonth;
                }
            }
        }
        String punchDay29 = (String) punchMap.get("punchDay29");
        String punchDay30 = (String) punchMap.get("punchDay30");
        String punchDay31 = (String) punchMap.get("punchDay31");
        List<PunchDetail> punchDetailList = new ArrayList<>();

        for (PunchExcel punchExcel : punchExcelList) {
            String punchName = punchExcel.getPunchName();
            if (!StringUtils.isEmpty(punchName)) {
                if (!StringUtils.isEmpty(punchExcel.getPunchCorp()) && punchExcel.getPunchCorp().equals("百思为科")) {
                    PunchDetail logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "01", punchExcel.getPunchTime1());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "02", punchExcel.getPunchTime2());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "03", punchExcel.getPunchTime3());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "04", punchExcel.getPunchTime4());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "05", punchExcel.getPunchTime5());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "06", punchExcel.getPunchTime6());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "07", punchExcel.getPunchTime7());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "08", punchExcel.getPunchTime8());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "09", punchExcel.getPunchTime9());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "10", punchExcel.getPunchTime10());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "11", punchExcel.getPunchTime11());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "12", punchExcel.getPunchTime12());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "13", punchExcel.getPunchTime13());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "14", punchExcel.getPunchTime14());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "15", punchExcel.getPunchTime15());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "16", punchExcel.getPunchTime16());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "17", punchExcel.getPunchTime17());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "18", punchExcel.getPunchTime18());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "19", punchExcel.getPunchTime19());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "20", punchExcel.getPunchTime20());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "21", punchExcel.getPunchTime21());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "22", punchExcel.getPunchTime22());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "23", punchExcel.getPunchTime23());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "24", punchExcel.getPunchTime24());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "25", punchExcel.getPunchTime25());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "26", punchExcel.getPunchTime26());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "27", punchExcel.getPunchTime27());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "28", punchExcel.getPunchTime28());
                    if (logPunchDetail != null) {
                        punchDetailList.add(logPunchDetail);
                    }
                    if (!StringUtils.isEmpty(punchDay29)) {
                        logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "29", punchExcel.getPunchTime29());
                        if (logPunchDetail != null) {
                            punchDetailList.add(logPunchDetail);
                        }
                    }
                    if (!StringUtils.isEmpty(punchDay30)) {
                        logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "30", punchExcel.getPunchTime30());
                        if (logPunchDetail != null) {
                            punchDetailList.add(logPunchDetail);
                        }
                    }
                    if (!StringUtils.isEmpty(punchDay31)) {
                        logPunchDetail = this.trans(Integer.valueOf(punchExcel.getPunchId()), punchName, punchYear, punchMonth, "31", punchExcel.getPunchTime31());
                        if (logPunchDetail != null) {
                            punchDetailList.add(logPunchDetail);
                        }
                    }
                }
            }
        }

        varMap = new HashMap<String, Object>();
        varMap.put("punchDetailList", punchDetailList);
        return ExcelUtil.exportFile(templatePath, "punchExport.xlsx", StringUtil.serial() + ".xlsx", "考勤记录.xlsx", varMap);
    }

    private PunchDetail trans(Integer punchId, String punchName, String punchYear, String punchMonth, String punchDay, String punchTime) {
        if (StringUtils.isEmpty(punchTime)) {
            punchTime = "";
        }
        String inTime = "";
        String outTime = "";
        if (punchTime.length() == 5) {
            if (punchTime.compareTo("12:00") < 0) {
                inTime = punchTime;
            } else {
                outTime = punchTime;
            }
        } else if (punchTime.length() > 5) {
            inTime = punchTime.substring(0, 5);
            outTime = punchTime.substring(punchTime.length() - 5, punchTime.length());
        }
        String punchDate = punchYear + "-" + punchMonth + "-" + punchDay;
        PunchDetail logPunchDetail = new PunchDetail();
        logPunchDetail.setPunchName(punchName);
        logPunchDetail.setPunchDate(punchDate);
        logPunchDetail.setPunchWeek(DateUtil.getWeek(punchDate, "yyyy-MM-dd"));
        logPunchDetail.setPunchYear(punchYear);
        logPunchDetail.setPunchMonth(punchMonth);
        logPunchDetail.setPunchDay(punchDay);
        logPunchDetail.setInTime(inTime);
        logPunchDetail.setOutTime(outTime);

        // holidayType:normal-工作日（法定节假日调整的周末也算正常工作日） weekend-周末 holiday-节假日 swap-上班
        // 判断是否节假日
        String holidayType = AppGlobal.sysHolidayMap.get(punchDate);
        if (holidayType == null) {
            if (logPunchDetail.getPunchWeek() > 5) {
                holidayType = "weekend";
            } else {
                holidayType = "normal";
            }
        }
        logPunchDetail.setHolidayType(holidayType);
        // punchState: normal-正常 leave-请假 swap-调休 absence-缺勤 over-加班
        String punchState = "";
        // leakRemark: leak-忘打卡 absence-缺勤
        String leakRemark = "";
        double checkHours = 0;
        if (holidayType.equals("normal") || holidayType.equals("swap")) {
            if (StringUtils.isEmpty(inTime) && StringUtils.isEmpty(outTime)) {
                punchState = "absence";
                leakRemark = "absence";
            } else {
                punchState = "normal";
                if (StringUtils.isEmpty(inTime) || StringUtils.isEmpty(outTime)) {
                    leakRemark = "leak";
                }
            }
            checkHours = 8;
        } else {
            if (!StringUtils.isEmpty(inTime) || !StringUtils.isEmpty(outTime)) {
                punchState = "over";
                if (StringUtils.isEmpty(inTime) || StringUtils.isEmpty(outTime)) {
                    leakRemark = "leak";
                }
            }
        }
        logPunchDetail.setPunchState(punchState);
        logPunchDetail.setLeakRemark(leakRemark);
        // 应出勤
        logPunchDetail.setCheckHours(checkHours);
        if (!StringUtils.isEmpty(inTime) && !StringUtils.isEmpty(outTime)) {
            // 计算工作时长
            logPunchDetail.setTotalHours(DateUtil.hourDiff(inTime, outTime, "HH:mm"));

            // 计算用餐时长
            double dinnerHours = 0;
            if (inTime.compareTo("12:30") < 0) {
                dinnerHours += 1;
            }
            if (outTime.compareTo("18:30") > 0) {
                dinnerHours += 0.5;
            }
            logPunchDetail.setDinnerHours(dinnerHours);

            // 实际出勤
            logPunchDetail.setRealHours(logPunchDetail.getTotalHours() > dinnerHours ? logPunchDetail.getTotalHours() - dinnerHours : 0);
        } else {
            logPunchDetail.setRealHours(0.0);
        }
        if (!StringUtils.isEmpty(inTime)) {
            if (inTime.compareTo("09:00") > 0) {
                // 迟到
                logPunchDetail.setLateHours(DateUtil.hourDiff("09:00", inTime, "HH:mm"));
            }
        }
        if (!StringUtils.isEmpty(outTime)) {
            if (outTime.compareTo("18:00") < 0) {
                // 早退
                logPunchDetail.setEarlyHours(DateUtil.hourDiff(outTime, "18:00", "HH:mm"));
            }
        }

        // 缺勤
        if (logPunchDetail.getCheckHours() > logPunchDetail.getRealHours()) {
            logPunchDetail.setLeakHours(logPunchDetail.getCheckHours() - logPunchDetail.getRealHours());
        }
        // 加班时长
        if (logPunchDetail.getRealHours() > logPunchDetail.getCheckHours() + 0.5) {
            logPunchDetail.setOverHours(logPunchDetail.getRealHours() - logPunchDetail.getCheckHours());
        }

        return logPunchDetail;
    }
}
