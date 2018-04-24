用到的相关表：
create table sys_holiday
(
    config_date varchar2(10 char) not null,
    holiday_type varchar2(30 char),
    holiday_name varchar2(90 char),
    remark varchar2(200 char),
    constraint sys_holiday_pk primary key(config_date)
);

create table demo_mix
(
    col_id varchar2(32 char) not null,
    col_number number(6),
    col_decimal number(16, 2),
    col_date date,
    col_dict varchar2(30),
    remark varchar2(200 char),
    constraint demo_mix_pk primary key(col_id)
);

insert into demo_mix(col_id, col_number, col_decimal, col_date, col_dict) values(sys_guid(), 315, 5780.38, sysdate, '01');
insert into demo_mix(col_id, col_number, col_decimal, col_date, col_dict) values(sys_guid(), 56789, 52321780.38, sysdate, '02');

create table demo_city
(
    city_code varchar2(6 char) not null,
    city_name varchar2(90 char),
    parent_code varchar2(6 char),
    city_type varchar2(30 char),
    remark varchar2(200 char),
    constraint demo_city_pk primary key(city_code)
);

insert into demo_city(city_code, city_name, parent_code, city_type) values('370000', '山东省', '', 'province');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370100', '济南市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370101', '市辖区', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370102', '历下区', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370103', '市中区', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370104', '槐荫区', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370105', '天桥区', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370112', '历城区', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370113', '长清区', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370124', '平阴县', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370125', '济阳县', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370126', '商河县', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370181', '章丘市', '370100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370200', '青岛市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370201', '市辖区', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370202', '市南区', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370203', '市北区', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370211', '黄岛区', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370212', '崂山区', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370213', '李沧区', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370214', '城阳区', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370281', '胶州市', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370282', '即墨市', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370283', '平度市', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370285', '莱西市', '370200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370300', '淄博市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370301', '市辖区', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370302', '淄川区', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370303', '张店区', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370304', '博山区', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370305', '临淄区', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370306', '周村区', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370321', '桓台县', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370322', '高青县', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370323', '沂源县', '370300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370400', '枣庄市', '370000', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370401', '市辖区', '370400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370402', '市中区', '370400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370403', '薛城区', '370400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370404', '峄城区', '370400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370405', '台儿庄区', '370400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370406', '山亭区', '370400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370481', '滕州市', '370400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370500', '东营市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370501', '市辖区', '370500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370502', '东营区', '370500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370503', '河口区', '370500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370505', '垦利区', '370500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370522', '利津县', '370500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370523', '广饶县', '370500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370600', '烟台市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370601', '市辖区', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370602', '芝罘区', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370611', '福山区', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370612', '牟平区', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370613', '莱山区', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370634', '长岛县', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370681', '龙口市', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370682', '莱阳市', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370683', '莱州市', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370684', '蓬莱市', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370685', '招远市', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370686', '栖霞市', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370687', '海阳市', '370600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370700', '潍坊市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370701', '市辖区', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370702', '潍城区', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370703', '寒亭区', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370704', '坊子区', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370705', '奎文区', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370724', '临朐县', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370725', '昌乐县', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370781', '青州市', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370782', '诸城市', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370783', '寿光市', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370784', '安丘市', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370785', '高密市', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370786', '昌邑市', '370700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370800', '济宁市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370801', '市辖区', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370811', '任城区', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370812', '兖州区', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370826', '微山县', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370827', '鱼台县', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370828', '金乡县', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370829', '嘉祥县', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370830', '汶上县', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370831', '泗水县', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370832', '梁山县', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370881', '曲阜市', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370883', '邹城市', '370800', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370900', '泰安市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370901', '市辖区', '370900', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370902', '泰山区', '370900', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370911', '岱岳区', '370900', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370921', '宁阳县', '370900', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370923', '东平县', '370900', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370982', '新泰市', '370900', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('370983', '肥城市', '370900', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371000', '威海市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371001', '市辖区', '371000', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371002', '环翠区', '371000', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371003', '文登区', '371000', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371082', '荣成市', '371000', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371083', '乳山市', '371000', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371100', '日照市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371101', '市辖区', '371100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371102', '东港区', '371100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371103', '岚山区', '371100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371121', '五莲县', '371100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371122', '莒县', '371100', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371200', '莱芜市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371201', '市辖区', '371200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371202', '莱城区', '371200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371203', '钢城区', '371200', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371300', '临沂市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371301', '市辖区', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371302', '兰山区', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371311', '罗庄区', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371312', '河东区', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371321', '沂南县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371322', '郯城县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371323', '沂水县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371324', '兰陵县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371325', '费县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371326', '平邑县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371327', '莒南县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371328', '蒙阴县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371329', '临沭县', '371300', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371400', '德州市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371401', '市辖区', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371402', '德城区', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371403', '陵城区', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371422', '宁津县', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371423', '庆云县', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371424', '临邑县', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371425', '齐河县', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371426', '平原县', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371427', '夏津县', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371428', '武城县', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371481', '乐陵市', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371482', '禹城市', '371400', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371500', '聊城市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371501', '市辖区', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371502', '东昌府区', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371521', '阳谷县', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371522', '莘县', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371523', '茌平县', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371524', '东阿县', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371525', '冠县', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371526', '高唐县', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371581', '临清市', '371500', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371600', '滨州市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371601', '市辖区', '371600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371602', '滨城区', '371600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371603', '沾化区', '371600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371621', '惠民县', '371600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371622', '阳信县', '371600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371623', '无棣县', '371600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371625', '博兴县', '371600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371626', '邹平县', '371600', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371700', '菏泽市', '370000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371701', '市辖区', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371702', '牡丹区', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371703', '定陶区', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371721', '曹县', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371722', '单县', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371723', '成武县', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371724', '巨野县', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371725', '郓城县', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371726', '鄄城县', '371700', 'area');
insert into demo_city(city_code, city_name, parent_code, city_type) values('371728', '东明县', '371700', 'area');

insert into demo_city(city_code, city_name, parent_code, city_type) values('110000', '北京市', '', 'province');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110100', '市辖区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110101', '东城区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110102', '西城区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110105', '朝阳区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110106', '丰台区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110107', '石景山区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110108', '海淀区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110109', '门头沟区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110111', '房山区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110112', '通州区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110113', '顺义区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110114', '昌平区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110115', '大兴区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110116', '怀柔区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110117', '平谷区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110118', '密云区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('110119', '延庆区', '110000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120000', '天津市', '', 'province');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120100', '市辖区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120101', '和平区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120102', '河东区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120103', '河西区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120104', '南开区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120105', '河北区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120106', '红桥区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120110', '东丽区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120111', '西青区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120112', '津南区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120113', '北辰区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120114', '武清区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120115', '宝坻区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120116', '滨海新区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120117', '宁河区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120118', '静海区', '120000', 'city');
insert into demo_city(city_code, city_name, parent_code, city_type) values('120119', '蓟州区', '120000', 'city');

