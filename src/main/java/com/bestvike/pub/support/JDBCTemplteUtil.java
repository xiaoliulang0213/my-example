package com.bestvike.pub.support;

/**
 * 配置table名称，自动生成mybatis中sql语句
 * Created by admin on 2017/11/22.
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCTemplteUtil {
    //orcl为oracle数据库中的数据库名，localhost表示连接本机的oracle数据�?
    //1521为连接的端口�?
    //private static String url="jdbc:oracle:thin:@localhost:1521:orcl";
    private static String url="jdbc:oracle:thin:@86.6.61.35:1521/maps";
    //system为登陆oracle数据库的用户�?
    //private static String user="wxkf";
    //private static String user="bvrfis180";
    private static String user="gzxt";
    //manager为用户名system的密�?
    //private static String password="wxkf";
    // private static String password="bvrfis180";
    private static String password="gzxt";
    public static Connection conn;
    public static PreparedStatement ps;
    public static ResultSet rs;
    public static Statement st ;
    //连接数据库的方法
    public Connection getConnection(){
        try {
            //初始化驱动包
            Class.forName("oracle.jdbc.driver.OracleDriver");
            //根据数据库连接字符，名称，密码给conn赋�??
            conn=DriverManager.getConnection(url, user, password);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
        }
        return conn;
    }
    //测试能否与oracle数据库连接成�?
    public static void main(String[] args) throws Exception {


/*
APPROVE_CONTRIBUTION_INFO
APPROVE_PROJECT_LEREP_INFO
DC_COMPANY
DC_INVEST_PROJECT
DC_PERSON
DC_PROJECT
EA_JC_STEP_BASICINFO
EA_JC_STEP_DONE
EA_JC_STEP_PROC
EA_JC_STEP_SPECIALNODE
PRE_APASINFO
PRE_COMM_FORM
PRE_FILE
PRE_FORM_FILE
 */
/*        getAutoCode("APPROVE_CONTRIBUTION_INFO".toUpperCase());
        getAutoCode("APPROVE_PROJECT_LEREP_INFO".toUpperCase());
        getAutoCode("DC_COMPANY".toUpperCase());
        getAutoCode("DC_INVEST_PROJECT".toUpperCase());
        getAutoCode("DC_PERSON".toUpperCase());
        getAutoCode("DC_PROJECT".toUpperCase());*/
        //getAutoCode("EA_JC_STEP_BASICINFO".toUpperCase());
        getAutoCode("sys_menu".toUpperCase());

        //zhuanhuan();
        //getAutoCode("EA_JC_STEP_PROC".toUpperCase());
/*        getAutoCode("EA_JC_STEP_SPECIALNODE".toUpperCase());
        getAutoCode("PRE_APASINFO".toUpperCase());
        getAutoCode("PRE_COMM_FORM".toUpperCase());
        getAutoCode("PRE_FILE".toUpperCase());
        getAutoCode("PRE_FORM_FILE".toUpperCase());*/
//        JDBC_Test basedao=new JDBC_Test();
//        basedao.getConnection();
//        if(conn==null){
//            System.out.println("与oracle数据库连接失败！");
//        }else{
//            System.out.println("与oracle数据库连接成功！");
//        }
    }

    public static void getAutoCode(String tableName) throws Exception{
        String sql = "select s.TABLE_NAME,s.COLUMN_NAME,"
                +" s.DATA_TYPE,c.COMMENTS,s.DATA_PRECISION,s.DATA_SCALE  from user_tab_columns s left join user_col_comments c on s.COLUMN_NAME "
                +" = c.COLUMN_NAME and s.TABLE_NAME = c.TABLE_NAME"
                +" where s.Table_Name= '"+tableName+"' order by s.COLUMN_ID asc";
        tableName  = tableName.toLowerCase();
        //System.out.println(sql);
        JDBCTemplteUtil basedao = new JDBCTemplteUtil();
        Connection conn = basedao.getConnection();
        //System.out.println(conn+"==conn");
        ps = conn.prepareStatement(sql);
        ResultSet rs =  ps.executeQuery();
        String  cloumns = "";
        StringBuffer listfff = new  StringBuffer();
        StringBuffer addfff = new  StringBuffer();
        StringBuffer updatefff = new  StringBuffer();
        StringBuffer deletefff = new  StringBuffer();
        StringBuffer insertsql = new StringBuffer();
        StringBuffer deletesql = new StringBuffer();
        StringBuffer updatesql = new StringBuffer();
        StringBuffer properties = new StringBuffer();
        StringBuffer setProperties = new StringBuffer();
        String tableOject = tableName.toLowerCase().replaceAll("wx_","");
        tableOject = tableOject.substring(0, 1).toUpperCase()+tableOject.substring(1);
        listfff.append("\t"+"<select id="+"\"list"+""+"\""+" parameterType=\"\" resultType=\"\">  "+"\n");
        addfff.append("\t"+"<insert id="+"\"save"+""+"\""+" parameterType=\"\">  "+"\n");
        addfff.append("\t\t\t"+"insert into "+tableName+"(\n");
        updatefff.append("\t"+"<update id="+"\"update"+""+"\""+" parameterType=\"\">  "+"\n");
        updatefff.append("\t\t\t"+"update \t"+tableName+"  \n");
        updatefff.append("\t\t\t"+"<set>  \n");
        listfff.append("\t\t\t"+"select"+"\n");
        StringBuffer columnList = new StringBuffer();
        String columnName = "";
        String comments = "";
        String dataType = "";
        int dataScale= 0;
        while(rs.next()){
            //tab�?   \t
//    		 System.out.println(rs.getString("COLUMN_NAME").toLowerCase());
//    		 System.out.println(rs.getString("DATA_TYPE"));
//    		 System.out.println(rs.getString("COMMENTS"));
            dataType = rs.getString("DATA_TYPE");
            columnName = rs.getString("COLUMN_NAME");
            comments = rs.getString("COMMENTS");
            dataScale = rs.getInt("DATA_SCALE");
            if(dataType.equals("VARCHAR2")){
                dataType = "VARCHAR";
            }
            columnList.append("\t\t\t\t"+columnName.toLowerCase()+","+(comments == null?"":"\t"+"<!--"+comments+"-->")+"\n");
            //insertsql.append("\t\t\t\t"+"#{"+zhuanhuan(columnName)+",jdbcType="+dataType+"},\n");
            insertsql.append("\t\t\t\t"+"#{"+zhuanhuan(columnName)+"},\n");
            updatefff.append("\t\t\t\t"+"<if test=\""+zhuanhuan(columnName)+" != null\"> "+columnName.toLowerCase()+" = #{"+zhuanhuan(columnName) +"}, </if>\t"+(comments ==  null?"":"<!--"+comments+"-->")+"\n");
           //properties.append("\t"+"@Column"+"\n");
            if(dataType.contains("VARCHAR")){
                properties.append("\t"+"private String "+zhuanhuan(columnName)+"; "+(comments == null?"":"//"+comments)+"\n");
            }else if(dataType.contains("NUMBER")){
                if(dataScale == 0){
                    properties.append("\t"+"private Integer "+zhuanhuan(columnName)+"; "+(comments == null?"":"//"+comments)+"\n");
                }else{
                    properties.append("\t"+"private BigDecimal "+zhuanhuan(columnName)+"; "+(comments == null?"":"//"+comments)+"\n");
                }
            }else if(dataType.contains("CLOB")){
                properties.append("\t"+"private String "+zhuanhuan(columnName)+"; "+(comments == null?"":"//"+comments)+"\n");
            }else{
                properties.append("\t"+"private String "+zhuanhuan(columnName)+"; "+(comments == null?"":"//"+comments)+"\n");
            }
            setProperties.append("set"+zhuanhuan(columnName).substring(0, 1).toUpperCase()+zhuanhuan(columnName).substring(1)+"();"+(comments == null?"":"//"+comments)+"\n");
        }
        listfff.append(columnList);
        cloumns = listfff.toString();
        int index = cloumns.lastIndexOf(",");
        //System.out.println(cloumns);
        String str = cloumns.substring(0,index) + cloumns.substring(index+1);
        String finalStr = str+("\t\t\t"+"from"+"\t"+tableName+"\n\t"+"</select>");
        String insertList =  insertsql.toString();
        index = insertList.lastIndexOf(",");
        insertList  =  insertList.substring(0,index) + insertList.substring(index+1);
        String columnListStr  = columnList.toString();
        index = columnListStr.lastIndexOf(",");
        columnListStr =  columnListStr.substring(0,index) + columnListStr.substring(index+1);
        addfff.append(columnListStr+"\t\t\t"+")values("+"\n"+insertList+"\t\t\t)");
        //System.out.println(finalStr+"\n");
        String updateStr =  updatefff.toString();
        index = updateStr.lastIndexOf(",");
        updateStr =  updateStr.substring(0,index) + updateStr.substring(index+1);
        updateStr = updateStr+"\t\t\t</set>";
        System.out.println(finalStr+"\n");
        System.out.println(addfff.toString()+"\n"+"\t"+"</insert>"+"\n");
        System.out.println(updateStr.toString()+"\n"+"\t"+"</update>"+"\n");
        System.out.println(properties.toString());
        //System.out.println(setProperties.toString());
        conn.close();
    }

    public static String  zhuanhuan(String a) {
        //String a = "dept_name_head";
        //System.out.println(a.indexOf("_"));
        String b = "";
        int begin = 0;
        String aaa = "";
        if (a.indexOf("_") != -1) {
            String arr[] = a.split("_");
            aaa = arr[0].toLowerCase();
            //arr[0]+arr[1].substring(0,1).toUpperCase()+arr[1].substring(1)+arr
            for (int i = 1; i < arr.length; i++) {
                aaa += arr[i].substring(0, 1).toUpperCase() + arr[i].substring(1).toLowerCase();
            }
        } else {
            return a.toLowerCase();
        }
        //ystem.out.println("aaa==" + aaa);
        return aaa;
    }
}
