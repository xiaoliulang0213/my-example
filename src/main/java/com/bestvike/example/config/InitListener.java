package com.bestvike.example.config;

import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class InitListener implements ServletContextListener {

    //@Autowired
    //private ConfigService configService;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        WebApplicationContextUtils.getRequiredWebApplicationContext(sce.getServletContext()).getAutowireCapableBeanFactory().autowireBean(this);
        
        //CacheGlobal.cacheSysDict(configService.selectSysDict());
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
