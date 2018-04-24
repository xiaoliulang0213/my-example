package com.bestvike.example.data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "demo_mix")
public class DemoMix implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String colId;
    private Integer colNumber;
    private BigDecimal colDecimal;
    private Date colDate;
    private String colDict;
    private String remark;

    public String getColId() {
        return colId;
    }

    public void setColId(String colId) {
        this.colId = colId;
    }

    public Integer getColNumber() {
        return colNumber;
    }

    public void setColNumber(Integer colNumber) {
        this.colNumber = colNumber;
    }

    public BigDecimal getColDecimal() {
        return colDecimal;
    }

    public void setColDecimal(BigDecimal colDecimal) {
        this.colDecimal = colDecimal;
    }

    public Date getColDate() {
        return colDate;
    }

    public void setColDate(Date colDate) {
        this.colDate = colDate;
    }

    public String getColDict() {
        return colDict;
    }

    public void setColDict(String colDict) {
        this.colDict = colDict;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}