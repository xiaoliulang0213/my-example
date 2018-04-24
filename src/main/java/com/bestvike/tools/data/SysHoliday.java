package com.bestvike.tools.data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;

@Entity
@Table(name="sys_holiday")
public class SysHoliday implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String configDate;
	private String holidayType;
    private String holidayName;
	private String remark;

    @Transient
    private String configDateStart;
    @Transient
    private String configDateEnd;

    public String getConfigDate() {
        return configDate;
    }

    public void setConfigDate(String configDate) {
        this.configDate = configDate;
    }

    public String getHolidayType() {
        return holidayType;
    }

    public void setHolidayType(String holidayType) {
        this.holidayType = holidayType;
    }

    public String getHolidayName() {
        return holidayName;
    }

    public void setHolidayName(String holidayName) {
        this.holidayName = holidayName;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getConfigDateStart() {
        return configDateStart;
    }

    public void setConfigDateStart(String configDateStart) {
        this.configDateStart = configDateStart;
    }

    public String getConfigDateEnd() {
        return configDateEnd;
    }

    public void setConfigDateEnd(String configDateEnd) {
        this.configDateEnd = configDateEnd;
    }
}
