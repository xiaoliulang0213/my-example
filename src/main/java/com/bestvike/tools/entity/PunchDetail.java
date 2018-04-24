package com.bestvike.tools.entity;

import java.io.Serializable;

public class PunchDetail implements Serializable {
    private static final long serialVersionUID = -1L;

    private Integer punchId;
    private String punchName;
    private String punchDate;
    private String punchYear;
    private String punchMonth;
    private String punchDay;
    private Integer punchWeek;
    private String inTime;
    private String outTime;
    private Double lateHours;
    private Double earlyHours;
    private Double totalHours;
    private String holidayType;
    private String punchState;
    private String leakRemark;
    private Double dinnerHours;
    private Double checkHours;
    private Double realHours;
    private Double leakHours;
    private Double overHours;

    public Integer getPunchId() {
        return punchId;
    }

    public void setPunchId(Integer punchId) {
        this.punchId = punchId;
    }

    public String getPunchName() {
        return punchName;
    }

    public void setPunchName(String punchName) {
        this.punchName = punchName;
    }

    public String getPunchDate() {
        return punchDate;
    }

    public void setPunchDate(String punchDate) {
        this.punchDate = punchDate;
    }

    public String getPunchYear() {
        return punchYear;
    }

    public void setPunchYear(String punchYear) {
        this.punchYear = punchYear;
    }

    public String getPunchMonth() {
        return punchMonth;
    }

    public void setPunchMonth(String punchMonth) {
        this.punchMonth = punchMonth;
    }

    public String getPunchDay() {
        return punchDay;
    }

    public void setPunchDay(String punchDay) {
        this.punchDay = punchDay;
    }

    public Integer getPunchWeek() {
        return punchWeek;
    }

    public void setPunchWeek(Integer punchWeek) {
        this.punchWeek = punchWeek;
    }

    public String getInTime() {
        return inTime;
    }

    public void setInTime(String inTime) {
        this.inTime = inTime;
    }

    public String getOutTime() {
        return outTime;
    }

    public void setOutTime(String outTime) {
        this.outTime = outTime;
    }

    public Double getLateHours() {
        return lateHours;
    }

    public void setLateHours(Double lateHours) {
        this.lateHours = lateHours;
    }

    public Double getEarlyHours() {
        return earlyHours;
    }

    public void setEarlyHours(Double earlyHours) {
        this.earlyHours = earlyHours;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }

    public String getHolidayType() {
        return holidayType;
    }

    public void setHolidayType(String holidayType) {
        this.holidayType = holidayType;
    }

    public String getPunchState() {
        return punchState;
    }

    public void setPunchState(String punchState) {
        this.punchState = punchState;
    }

    public String getLeakRemark() {
        return leakRemark;
    }

    public Double getDinnerHours() {
        return dinnerHours;
    }

    public void setDinnerHours(Double dinnerHours) {
        this.dinnerHours = dinnerHours;
    }

    public Double getCheckHours() {
        return checkHours;
    }

    public void setCheckHours(Double checkHours) {
        this.checkHours = checkHours;
    }

    public Double getRealHours() {
        return realHours;
    }

    public void setRealHours(Double realHours) {
        this.realHours = realHours;
    }

    public Double getLeakHours() {
        return leakHours;
    }

    public void setLeakHours(Double leakHours) {
        this.leakHours = leakHours;
    }

    public Double getOverHours() {
        return overHours;
    }

    public void setOverHours(Double overHours) {
        this.overHours = overHours;
    }

    public void setLeakRemark(String leakRemark) {
        this.leakRemark = leakRemark;
    }
}
