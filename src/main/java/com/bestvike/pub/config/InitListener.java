package com.bestvike.pub.config;

import com.bestvike.tools.service.SysHolidayService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class InitListener implements ServletContextListener {
    protected Log logger = LogFactory.getLog(this.getClass());

    @Autowired
    private SysHolidayService sysHolidayService;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        WebApplicationContextUtils.getRequiredWebApplicationContext(sce.getServletContext()).getAutowireCapableBeanFactory().autowireBean(this);

        AppGlobal.sysHolidayMap = sysHolidayService.cacheAll();
//        Global.sysCode = sysCode;
//        cacheService.cacheDicPubList();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
