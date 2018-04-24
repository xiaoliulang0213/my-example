package com.bestvike.example.dao;

import com.bestvike.example.data.LogFile;
import org.mybatis.mapper.common.BaseMapper;
import org.springframework.stereotype.Repository;

@Repository
public interface LogFileDao extends BaseMapper<LogFile> {
}
