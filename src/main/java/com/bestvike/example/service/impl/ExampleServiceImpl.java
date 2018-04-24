package com.bestvike.example.service.impl;

import com.bestvike.commons.mybatis.QueryParam;
import com.bestvike.commons.mybatis.Select;
import com.bestvike.example.dao.SysCityDao;
import com.bestvike.example.data.SysCity;
import com.bestvike.example.service.ExampleService;
import com.bestvike.pub.service.BaseService;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.utils.PaginationList;
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
public class ExampleServiceImpl extends BaseService implements ExampleService {
    @Autowired
    private SysCityDao sysCityDao;

    @Override
    public List<SysCity> selectAll() {
        return sysCityDao.selectAll();
    }
    @Override
    public SysCity initCity(String cityCode) {
        Map<String, Object> parameterMap = new HashMap<>();
        if (!StringUtils.isEmpty(cityCode)) {
            parameterMap.put("cityCode", cityCode);
        }
        return sysCityDao.initCity(parameterMap);
    }
    @Override
    public List<SysCity> selectCity(String cityCode, String q) {
        Map<String, Object> parameterMap = new HashMap<>();
        if (!StringUtils.isEmpty(cityCode)) {
            parameterMap.put("cityCode", cityCode);
        }
        if (!StringUtils.isEmpty(q)) {
            parameterMap.put("q", "%" + q + "%");
        }
        return sysCityDao.selectCity(parameterMap);
    }

    @Override
    public SysCity initCity(QueryParam queryParam) {
        Select select = new Select(SysCity.class);
        select.init(queryParam);
        return sysCityDao.initCity(select.getParameterMap());
    }
    @Override
    public List<SysCity> selectCity(QueryParam queryParam) {
        Select select = new Select(SysCity.class);
        select.init(queryParam);
        return sysCityDao.selectCity(select.getParameterMap());
    }

    @Override
    public PaginationList<SysCity> pageCity(QueryParam queryParam) {
        Map<String, Object> parameterMap = new HashMap<>();
        if (!StringUtils.isEmpty(queryParam.getQ())) {
            parameterMap.put("q", "%" + queryParam.getQ() + "%");
        }
        return sysCityDao.selectCity(parameterMap, new RowBounds(0, queryParam.getLimit(), true));
    }
}
