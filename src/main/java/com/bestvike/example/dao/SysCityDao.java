package com.bestvike.example.dao;

import com.bestvike.example.data.SysCity;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.utils.PaginationList;
import org.mybatis.mapper.common.BaseMapper;

import java.util.List;
import java.util.Map;

public interface SysCityDao extends BaseMapper<SysCity> {
    public SysCity initCity(Map<String, Object> parameterMap);
    public List<SysCity> selectCity(Map<String, Object> parameterMap);
    public PaginationList<SysCity> selectCity(Map<String, Object> parameterMap, RowBounds rowBounds);
}
