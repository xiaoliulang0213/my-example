package com.bestvike.example.data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "demo_dict")
public class DemoDict implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String dictId;
    private String dictCode;
    private String dictShow;
    private Integer dictLevel;
    private String parentId;
    private String parentCode;
    private Integer showOrder;
    private Date manageTime;
    private String manageUser;
    private String remark;

    public String getDictId() {
        return dictId;
    }

    public void setDictId(String dictId) {
        this.dictId = dictId;
    }

    public String getDictCode() {
        return dictCode;
    }

    public void setDictCode(String dictCode) {
        this.dictCode = dictCode;
    }

    public String getDictShow() {
        return dictShow;
    }

    public void setDictShow(String dictShow) {
        this.dictShow = dictShow;
    }

    public Integer getDictLevel() {
        return dictLevel;
    }

    public void setDictLevel(Integer dictLevel) {
        this.dictLevel = dictLevel;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public Integer getShowOrder() {
        return showOrder;
    }

    public void setShowOrder(Integer showOrder) {
        this.showOrder = showOrder;
    }

    public Date getManageTime() {
        return manageTime;
    }

    public void setManageTime(Date manageTime) {
        this.manageTime = manageTime;
    }

    public String getManageUser() {
        return manageUser;
    }

    public void setManageUser(String manageUser) {
        this.manageUser = manageUser;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}