package com.bestvike.example.controller;

import com.bestvike.commons.mybatis.QueryColumn;
import com.bestvike.commons.mybatis.QueryParam;
import com.bestvike.commons.service.CommonService;
import com.bestvike.commons.util.ExcelUtil;
import com.bestvike.commons.util.FileUtil;
import com.bestvike.commons.util.StringUtil;
import com.bestvike.example.data.LogFile;
import com.bestvike.example.data.SysCity;
import com.bestvike.example.service.ExampleService;
import com.bestvike.example.service.FileService;
import com.bestvike.pub.controller.BaseController;
import org.apache.ibatis.utils.PaginationList;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.jxls.area.Area;
import org.jxls.builder.AreaBuilder;
import org.jxls.builder.xml.XmlAreaBuilder;
import org.jxls.common.CellRef;
import org.jxls.common.Context;
import org.jxls.transform.Transformer;
import org.jxls.transform.poi.PoiTransformer;
import org.jxls.util.TransformerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.xml.sax.SAXException;

import java.io.*;
import java.util.*;

/**
 * Created by lihua on 2017/2/21.
 */
@RestController
@RequestMapping("/api/example")
public class ExampleController extends BaseController {
    @Autowired
    private ExampleService exampleService;
    @Autowired
    private FileService fileService;
    @Autowired
    private CommonService commonService;

    public ExampleController() {
        super("FF");
    }

    @RequestMapping(value = "/initCity", method = RequestMethod.GET)
    public SysCity initCityGet(@RequestParam(value = "cityCode", required = false) String cityCode) {
        return exampleService.initCity(cityCode);
    }

    @RequestMapping(value = "/selectCity", method = RequestMethod.GET)
    public List<SysCity> selectCityGet(@RequestParam(value = "cityCode", required = false) String cityCode, @RequestParam(value = "q", required = false) String q) {
        return exampleService.selectCity(cityCode, q);
    }

    @RequestMapping(value = "/initCity", method = RequestMethod.POST)
    public SysCity initCity(@RequestBody QueryParam queryParam) {
        return exampleService.initCity(queryParam);
    }

    @RequestMapping(value = "/selectCity", method = RequestMethod.POST)
    public List<SysCity> selectCity(@RequestBody QueryParam queryParam) {
        return exampleService.selectCity(queryParam);
    }

    @RequestMapping(value = "/pageCity", method = {RequestMethod.GET, RequestMethod.POST})
    public PaginationList<SysCity> pageCity(@RequestBody QueryParam queryParam) {
        return exampleService.pageCity(queryParam);
    }

    @RequestMapping(value = "/import", method = RequestMethod.POST)
    public List<SysCity> imports(@RequestBody String fileSign) throws IOException, InvalidFormatException, SAXException {
        if (!StringUtils.isEmpty(fileSign)) {
            LogFile logFile = fileService.selectBySign(fileSign);
            if (logFile != null) {
                Map<String, Object> varMap = new HashMap<String, Object>();
                List<SysCity> sysCityList = new ArrayList<>();
                varMap.put("sysCityList", sysCityList);

                ExcelUtil.importFile(templatePath, "sysCityImport.xml", new FileInputStream(logFile.getFilePath() + logFile.getFileName()), varMap);
                return sysCityList;
            }
        }
        return null;
    }

    @RequestMapping(value = "/export", method = RequestMethod.POST)
    public Map<String, Object> exports(@RequestBody QueryParam queryParam) throws IOException {
        Map<String, Object> varMap = new HashMap<>();
        List<SysCity> sysCityList = commonService.selectByFilter(queryParam);
        varMap.put("sysCityList", sysCityList);
        return ExcelUtil.exportFile(templatePath, "sysCityExport.xlsx", StringUtil.serial() + ".xlsx", "城市导出.xlsx", varMap);
    }

    @RequestMapping(value = "/exportDynamic", method = RequestMethod.POST)
    public Map<String, Object> exportDynamic(@RequestBody QueryParam queryParam) throws IOException {
        List<SysCity> sysCityList = commonService.selectByFilter(queryParam);
        Context context = new Context();
        Map<String, Object> varMap = new HashMap<>();
        varMap.put("props", "cityCode,cityName,parentCode");
        varMap.put("headers", Arrays.asList("城市代码", "城市名称", "上级城市"));
        varMap.put("data", sysCityList);
        return ExcelUtil.exportGridFile(templatePath, "sysCityExportDynamic.xlsx", StringUtil.serial() + ".xlsx", "城市导出.xlsx", varMap);

        /*logger.info("Preparing test data");
        List<String> headers = new ArrayList<String>(Arrays.asList("Param 1", "Param 2", "Param 3", "Param 4", "Param 5"));
        List<List<Object>> rows = new ArrayList<>();
        for(int i = 0; i < 10; i++){
            List<Object> row = new ArrayList<>();
            for(int k = 0; k < 5; k++){
                row.add(String.format("Val(%s,%s)", i, k));
            }
            rows.add(row);
        }

        // loading areas and commands using XmlAreaBuilder
        final String DYNAMIC_COLUMNS_DEMO_XML_CONFIG = "dynamic_columns_demo.xml";
        final String TEMPLATE = "dynamic_columns_demo.xls";
        final String OUTPUT = "d:/dynamic_columns_output.xls";
        logger.info("Preparing test data");
        List<String> headers = new ArrayList<String>(Arrays.asList("Param 1", "Param 2", "Param 3", "Param 4", "Param 5"));
        List<List<Object>> rows = new ArrayList<>();
        for(int i = 0; i < 10; i++){
            List<Object> row = new ArrayList<>();
            for(int k = 0; k < 5; k++){
                row.add(String.format("Val(%s,%s)", i, k));
            }
            rows.add(row);
        }
        try(InputStream is = FileUtil.getInputStream(templatePath + File.separator + TEMPLATE)) {
            try (OutputStream os = new FileOutputStream(OUTPUT)) {
                Transformer transformer = TransformerFactory.createTransformer(is, os);
                InputStream configInputStream = FileUtil.getInputStream(templatePath + File.separator + DYNAMIC_COLUMNS_DEMO_XML_CONFIG);
                AreaBuilder areaBuilder = new XmlAreaBuilder(configInputStream, transformer);
                List<Area> xlsAreaList = areaBuilder.build();
                Area xlsArea = xlsAreaList.get(0);
                // creating context
                Context context = PoiTransformer.createInitialContext();
                context.putVar("headers", headers);
                context.putVar("rows", rows);
                // applying transformation
                logger.info("Applying area " + xlsArea.getAreaRef() + " at cell " + new CellRef("Result!A1"));
                xlsArea.applyAt(new CellRef("Result!A1"), context);
                // saving the results to file
                transformer.write();
                logger.info("Complete");
            }
        }
        return null;*/
    }

    @RequestMapping("/demo1")
    public String demo1() {
        return "success";
    }

    @RequestMapping("/demo2")
    public void demo2() {
    }

    @RequestMapping("/formInitUrl")
    public Map<String, Object> formInitUrl() {
        Map<String, Object> map = new HashMap<>();
        map.put("demo1", "xxxxxx");
        map.put("demo2", "yyyyyy");
        return map;
    }

    @RequestMapping(value = "/dynamicTable1", method = RequestMethod.GET)
    public List<Map<String, Object>> dynamicTable1() {
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> map = new HashMap<>();
        map.put("name", "cityCode");
        map.put("head", "城市代码");
        list.add(map);
        map = new HashMap<>();
        map.put("name", "cityName");
        map.put("head", "城市名称");
        list.add(map);
        return list;
    }

    @RequestMapping(value = "/dynamicTable2", method = RequestMethod.POST)
    public PaginationList<Map<String, Object>> dynamicTable2(@RequestBody(required = false) QueryParam queryParam) {
        String type = "";
        if (queryParam == null || queryParam.getParamList() == null || queryParam.getParamList().size() == 0) {
            // type = "default";
        } else {
            List<QueryColumn> paramList = queryParam.getParamList();
            for (QueryColumn queryColumn : paramList) {
                if (queryColumn.getName().equals("xxx")) {
                    if (queryColumn.getValue() != null) {
                        if (queryColumn.getValue().equals("A")) {
                            type = "A";
                        } else if (queryColumn.getValue().equals("B")) {
                            type = "B";
                        }
                    }
                }
            }
        }

        if (StringUtils.isEmpty(type)) {
            PaginationList<Map<String, Object>> result = new PaginationList<>();
            List<Map<String, Object>> columns = new ArrayList<>();
            Map<String, Object> column = new HashMap<>();
            column.put("name", "cityCode");
            column.put("head", "城市代码");
            column.put("filter", "=");
            columns.add(column);
            column = new HashMap<>();
            column.put("name", "cityName");
            column.put("head", "城市名称");
            columns.add(column);
            // Map<String, Object> result = new HashMap<>();
            result.setColumns(columns);
            List<Map<String, Object>> data = new ArrayList<>();
            Map<String, Object> map = new HashMap<>();
            map.put("cityCode", "01");
            map.put("cityName", "城市1");
            data.add(map);
            map = new HashMap<>();
            map.put("cityCode", "02");
            map.put("cityName", "城市2");
            data.add(map);
            result.setData(data);
            result.setCount(111);
            return result;
        } else if (type.equals("A")) {
            PaginationList<Map<String, Object>> result = new PaginationList<>();
            List<Map<String, Object>> columns = new ArrayList<>();
            Map<String, Object> column = new HashMap<>();
            column.put("name", "cityCode");
            column.put("head", "城市代码1");
            columns.add(column);
            column = new HashMap<>();
            column.put("name", "cityName");
            column.put("head", "城市名称1");
            column.put("filter", "=");
            columns.add(column);
            // Map<String, Object> result = new HashMap<>();
            result.setColumns(columns);
            List<Map<String, Object>> data = new ArrayList<>();
            Map<String, Object> map = new HashMap<>();
            map.put("cityCode", "01");
            map.put("cityName", "城市1");
            data.add(map);
            map = new HashMap<>();
            map.put("cityCode", "02");
            map.put("cityName", "城市2");
            data.add(map);
            result.setData(data);
            result.setCount(111);
            Map<String, Object> filterValue = new HashMap<>();
            filterValue.put("xxx", "A");
            result.setFilterValue(filterValue);
            return result;
        } else if (type.equals("B")) {
            PaginationList<Map<String, Object>> result = new PaginationList<>();
            List<Map<String, Object>> columns = new ArrayList<>();
            Map<String, Object> column = new HashMap<>();
            column.put("name", "cityCode");
            column.put("head", "城市代码2");
            columns.add(column);
            column = new HashMap<>();
            column.put("name", "cityName");
            column.put("head", "城市名称2");
            columns.add(column);
            column = new HashMap<>();
            column.put("name", "remark");
            column.put("head", "备注2");
            column.put("filter", "=");
            columns.add(column);
            // Map<String, Object> result = new HashMap<>();
            result.setColumns(columns);
            List<Map<String, Object>> data = new ArrayList<>();
            Map<String, Object> map = new HashMap<>();
            map.put("cityCode", "01");
            map.put("cityName", "城市1");
            map.put("remark", "备注1");
            data.add(map);
            map = new HashMap<>();
            map.put("cityCode", "02");
            map.put("cityName", "城市2");
            map.put("remark", "备注2");
            data.add(map);
            result.setData(data);
            result.setCount(111);
            Map<String, Object> filterValue = new HashMap<>();
            filterValue.put("xxx", "B");
            result.setFilterValue(filterValue);
            return result;
        }
        return null;
    }
}
