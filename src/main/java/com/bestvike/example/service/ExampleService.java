package com.bestvike.example.service;

import com.bestvike.commons.mybatis.QueryParam;
import com.bestvike.example.data.SysCity;
import org.apache.ibatis.utils.PaginationList;

import java.util.List;

public interface ExampleService {
    public List<SysCity> selectAll();
    public SysCity initCity(String cityCode);
    public List<SysCity> selectCity(String cityCode, String q);
    public SysCity initCity(QueryParam queryParam);
    public List<SysCity> selectCity(QueryParam queryParam);
    public PaginationList<SysCity> pageCity(QueryParam queryParam);
}
