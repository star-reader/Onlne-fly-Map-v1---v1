var player = [];
var map;
var WzpLocation = "/public/online/whazzup.txt";
function initMap() {
    timer = setInterval(function () {
        refreshMapAjax();
    }, 3E4);
    map = L.map('map').setView([35, 108], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; SKYline天际模飞俱乐部'
    }).addTo(map);
    ajaxInit(WzpLocation);
}
function refreshMap() {
    clearTable();
    clearMap();
    player=[]
    var a = map.getCenter(),
        b = map.getZoom();
    void 0 != map && (map.off(), map.remove());
    map = L.map("map").setView(a, b);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        noWrap: !0,
        attribution: '&copy; SKYline天际模飞俱乐部',
        maxZoom: 9
    }).addTo(map);
    ajaxInit("", initPlayer, !0);
}
function refreshMapAjax() {
    clearTable();
    clearMap();
    player=[]
    ajaxInit(WzpLocation, initPlayer, !0);
}
function clearTable() {
    $("#atc-body").html("")
    $("#pilot-body").html("")
}
function clearMap() {
    for(var i=0;i<player.length;i++){
        map.removeLayer(player[i].marker)
    }
}
function addMarker(player, message) {
    if (player.type == "PILOT") {
        var icon = L.icon({
            iconUrl: "public/img/aircraft_autonavi.png",
            iconAnchor: [10, 10]
        });
        player.marker = L.marker([player.lat, player.lng], {
                icon: icon,
                rotationAngle: player.heading,
            })
            .bindPopup(message, {
                "minWidth": "450px"
            })
            .addTo(map)
    } else if (player.type == "ATC") {
        var icon = L.icon({
            iconUrl: "public/img/marker_atc.png",
            iconAnchor: [140,160]
        });
        player.marker = L.marker([player.lat, player.lng], {
                icon: icon
            })
            .bindPopup(message, {
                "minWidth": "420px"
            })
            .addTo(map)
    }
}
function addPlayer2List(player) {
    if (player.type == "PILOT") $("#pilot-body").html($("#pilot-body").html() + `<tr><td>${player.callsign}</td><td>${player.departure}</td><td>${player.destination}</td></tr>`);
    else if (player.type == "ATC") $("#atc-body").html($("#atc-body").html() + `<tr><td>${player.callsign}</td><td>${player.realname}</td><td>${getATCLevel(player.rating)}</td></tr>`);
}
function addRader(lat, lng, range) {
//画个圆
// var circle = new Circle({
//    center: new (ctl['lng'], ctl['lat']),// 圆心位置
//        radius: ctl['visual_range']*1.852*1000, //半径
//    strokeColor: "#0000ff", //线颜色
//    strokeOpacity: 0.5, //线透明度
//    strokeWeight: 1, //线粗细度
 //    fillColor: "#0000ee", //填充颜色
//    fillOpacity: 0.1//填充透明度
//});
}

function getPlayerMessage(p) {
    callsign = p.callsign;
    realname = p.realname;
    alt = p.alt;
    gs = p.ground_speed;
    dep = p.departure;
    arr = p.destination;
    transponder = p.transponder;
    server_ident = p.server_ident;
    aircraft = p.aircraft;
    // route = p.round;
    route = p.route;
    visual_range = p.visual_range;
    if (p.type == "PILOT") {

        return '<table border="0" cellpadding="0" cellspacing="0" style="width:260px;height:50px;"><tr><td colspan="4" class="mdui-text-center"><a style=font-size:20px; href="javascript:void(0)" onclick="ShowPilotList();" >点击查看机组详细信息</a><br><h4>' + callsign + '</br><h4> </table>'
            + '</div >' +
        '<div class="title" id="title" >'+
            '<div  style="font-size:20px;color:whitesmoke;text-align:center;">SKYline航班信息|SKYline Radar</div>'+
        '</div>'+
        '<div class="titpic"  id="titpic">'+
            '<img name="img" id="img" src="public/img/skyline.png" class="titpic" overflow-x:hidden; overflow-y:hidden; style="border: medium none;display:none;" alt=""; >'+
        '</div>'+
        '<div class="flight" id="flight">'+
            '<div class="flight-text-dep" id="flight-text-dep">'+
                '<h2>起飞 | DEP</h3>'+
            '</div>'+
            '<div class="flight-text-arr" id="flight-text-arr">'+
                '<h2>到达 | ARR</h3>'+
            '</div>'+
            '<div class="flight-main-dep" id="flight-main-dep">'+
                '<p style="color: #2F4E7C;font-size:42px;font-weight:bold;">'+dep+'</p>'+
            '</div>'+
            '<div class="flight-icon" id="flight-icon">'+
                '<p style="color: #2F4E7C;font-size:40px;font-weight:bold;">→</p>'+
            '</div>'+
            '<div class="flight-main-arr" id="flight-main-arr">'+
                '<p style="color: #2F4E7C;font-size:42px;font-weight:bold;">'+arr+'</p>'+
            '</div>'+
        '</div>'+
        '<div class="dscallsign" id="dscallsign">'+
            '<div class="dscallsign-main" id="dscallsign-main">' +
            '<p style="color:orange;font-size:25px;font-weight:bold;">' + callsign+'</p>' +
            '</div>'+
        '</div>'+
        '<div class="data" id="data">'+
            '<div class="data-text-type" id="data-text-type">'+
                '<p style="font-size:20px;">机型</p>'+
            '</div>'+
            '<div class="data-text-heading" id="data-text-heading">'+
                '<p style="font-size:20px;">当前航向</p>'+
            '</div>'+
            '<div class="data-main-type" id="data-main-type">' +
            '<p style="font-size:20px;font-weight:bold;">' + aircraft+'</p>' +
            '</div>'+
            '<div class="data-main-heading" id="data-main-heading">'+
                '<p style="font-size:22px;font-weight:bold;">N/A</p>'+
            '</div>'+
            '<div class="data-text-alt" id="data-text-alt">'+
                '<p style="font-size:20px;">当前高度</p>'+
            '</div>'+
            '<div class="data-text-swk" id="data-text-swk">'+
                '<p style="font-size:20px;">应答机</p>'+
            '</div>'+
            '<div class="data-main-alt" id="data-main-alt">'+
                '<p style="font-size:22px;font-weight:bold;">'+alt+'</p>'+
            '</div>'+
            '<div class="data-main-swk" id="data-main-swk">' +
            '<p style="font-size:22px;font-weight:bold;">' + transponder+'</p>' +
            '</div>'+
            '<div class="data-text-spd" id="data-text-spd">'+
                '<p style="font-size:20px;">当前地速</p>'+
            '</div>'+
            '<div class="data-text-plt" id="data-text-plt">'+
                '<p style="font-size:20px;">所在平台</p>'+
            '</div>'+
            '<div class="data-main-spd" id="data-main-spd">'+
                '<p style="font-size:22px;font-weight:bold;">'+gs+'</p>'+
            '</div>'+
            '<div class="data-main-plt" id="data-main-plt">'+
                '<p style="font-size:22px;font-weight:bold;">SKYline</p>'+
            '</div>'+
        '</div>'+
        '<div class="route" id="route">'+
            '<div class="route-title" id="route-title">'+
                '<p style="color:orange;font-size:23px;font-weight:bold;">航路</p>'+
            '</div>'+
        '</div>'+
        '<div class="route-main" id="route-main">'+
            '<div class="route-con" id="route-con">'+
               ' <p style="font-size:20px;">'+route+' </p>'+
            '</div>' +
        '</div>'
    } else if (p.type == "ATC") {
        return '<table border="0" cellpadding="0" cellspacing="0" style="width:260px;height:50px;"><tr><td colspan="4" class="mdui-text-center"><a style=font-size:20px; href="javascript:void(0)" onclick="ShowATCList();" >点击查看管制员详细信息</a><br><h4>' + callsign + '</br><h4> </table>' +
        '<div class="atctitle" id="atctitle">'+
        '<div style="font-size:20px;color:whitesmoke;text-align:center;">SKYline管制员信息|SKYline Radar</div>'+
    '</div>'+
    '<div class="atcti" id="atcti">'+
        '<div class="atcti-main" id="atcti-main">'+
            '<p style="color:orange;font-size:25px;font-weight:bold;">管制员详细信息</p>'+
        '</div>'+
    '</div>'+
    '<div class="atcdata" id="atcdata">'+
        '<div class="atcdata-text-callsign" id="atcdata-text-callsign">'+
            '<p style="font-size:20px;">席位</p>'+
        '</div>'+
        '<div class="atcdata-text-call" id="atcdata-text-call">'+
            '<p style="font-size:20px;">昵称</p>'+
        '</div>'+
        '<div class="atcdata-main-callsign" id="atcdata-main-callsign">'+
            '<p style="font-size:22px;font-weight:bold;">'+callsign+'</p>'+
        '</div>'+
            '<div class="atcdata-main-call" id="atcdata-main-call">' +
            '<p style="font-size:22px;font-weight:bold;">' + realname+'</p>' +
        '</div>'+
        '<div class="atcdata-text-can" id="atcdata-text-can">'+
            '<p style="font-size:20px;">所在频道</p>'+
        '</div>'+
        '<div class="atcdata-text-range" id="atcdata-text-range">'+
            '<p style="font-size:20px;">管制范围</p>'+
        '</div>'+
            '<div class="atcdata-main-can" id="atcdata-main-can">' +
            '<p style="font-size:22px;font-weight:bold;">' + p.freq+'</p>' +
        '</div>'+
            '<div class="atcdata-main-range" id="atcdata-main-range">' +
            '<p style="font-size:22px;font-weight:bold;">' + visual_range+'</p>' +
        '</div>'+
        '<div class="atcdata-text-rate" id="atcdata-text-rate">'+
            '<p style="font-size:20px;">管制等级</p>'+
        '</div>'+
        '<div class="atcdata-text-plt" id="atcdata-text-plt">'+
            '<p style="font-size:20px;">所在平台</p>'+
        '</div>'+
        '<div class="atcdata-main-rate" id="atcdata-main-rate">'+
            '<p style="font-size:22px;font-weight:bold;">' + getATCLevel(p.rating) + '</p>'+
        '</div>'+
        '<div class="atcdata-main-plt" id="atcdata-main-plt">'+
            '<p style="font-size:22px;font-weight:bold;">SKYline</p>'+
        '</div>'+
    '</div>'

        //    return '<table cellpadding="0" cellspacing="0" style="width:420px">\t<tr class="tra">\t\t<td colspan="4" class="mdui-text-center"><h4>管制员详细信息</h4></td>   </tr>   <tr>       <td width="80">席位</td><td width="120">' + callsign + '</td>       <td width="80">昵称</td><td width="140">' + realname + "</td>   </tr>   <tr>       <td>频率</td><td>" +
        //        p.freq + "</td>       <td>等级</td><td>" + getATCLevel(p.rating) + '</td>   </tr>   <tr rowspan="2">       <td>雷达范围</td><td>' + visual_range + "</td>   </tr></table>";
        //}
    }





}



function initPlayer() {
    for (var i = 0; i < Object.keys(player).length; i++) {
        console.log(player[i].type)
        console.log(player[i].heading)
        addMarker(player[i], getPlayerMessage(player[i]))
        addPlayer2List(player[i])
    }
}
function getATCLevel(num) {
    return {
        1: "Observer",
        2: "Student1",
        3: "Student2",
        4: "Student3",
        5: "Controller1",
        6: "Controller2",
        7: "Controller3",
        8: "Instructor1",
        9: "Instructor2",
        10: "Instructor3",
        11: "Supervisor",
        12: "Administrator"
    } [num];
}
function formatWhazzup(whazzup) {
    for (var i = 0; i < whazzup.length; i++) {
        var key = whazzup[i].split(":");
        for (var j = 0; j < key.length; j++) key[j] = key[j].trim();
        if (!(5 > key.length || "" == key[5] || "" == key[3])) {
            var d = {};
            d.callsign = key[0];
            d.realname = key[2];
            d.type = key[3];
            d.freq = parseFloat(key[4]);
            d.lat = parseFloat(key[5]);
            d.lng = parseFloat(key[6]);
            d.alt = parseFloat(key[7]);
            d.ground_speed = parseFloat(key[8]);
            d.aircraft = key[9];
            d.cruising_alt = key[10];
            d.departure = key[11];
            d.cruising_level = key[12];
            d.destination = key[13];
            d.server_ident = key[14];
            d.rating = key[16];
            d.transponder = key[17];
            d.visual_range = parseInt(key[19]);
            d.plan_type = key[21];
            d.departure_time = key[22];
            d.alternative = key[28];
            d.route = key[30];
            d.marker = null;
            d.circle = null;
            d.pitch_bank_heading = key[key.length - 1];
            d.heading = Math.round(((parseInt(d.pitch_bank_heading) & 4092) >> 2) / 1024 * 360);
            d.radius = 1E3 * d.visual_range / 2;
            player.push(d);

        }
    }

}
function getPlayerList(a) {
    if (null != a) {
        var b = a.indexOf("!CLIENTS"),
            c = a.indexOf("!SERVERS");
        return a.substring(b + 9, c - 1).split("\n");
    }
    return null;
}
function ajaxInit(url) {
    $.ajax({
        url: url + "?" + Math.random(),
        success: function (result) {
            formatWhazzup(getPlayerList(result));
            initPlayer()
        }
    });
}

var fsd = {
    wd: {},
    pilot_sign: "",
    atc_sign: "",
    ser_sign: "",
    gdmap: false,
    icon: {},
    map_center: false,
    map_zoom: false,
    markers: {},
    atcs: {},
    run: function () {
        var self = this;
        self.search_btn_click();
        self.getdata();
    },
    getdata: function () {
        var self = this;
        $.ajax({
            type: "GET",
            url: "data.php",
            dataType: "json",
            success: function (d) {
                console.log(d);
                self.wd = d;
                self.map_init();
                self.stru_pilot();
                self.stru_atc();
                self.stru_serv();

                self.pilot_draw();
                self.atc_draw();

                self.map_zc_set();

                self.map_view();
                self.table_info_tr_click();
                setTimeout("fsd.getdata()", 1000);
            }
        });
    },
}
function ShowPilotList() {
    var title = document.getElementById('title');
    var titpic = document.getElementById('titpic');
    var img = document.getElementById("img");
    var flight = document.getElementById('flight');
    var flighttextdep = document.getElementById('flight-text-dep');
    var flighttextarr = document.getElementById('flight-text-arr');
    var flightmaindep = document.getElementById('flight-main-dep');
    var flightmainarr = document.getElementById('flight-main-arr');
    var flighticon = document.getElementById('flight-icon');
    var dscallsign = document.getElementById('dscallsign');
    var dscallsignmain = document.getElementById('dscallsign-main');
    var data = document.getElementById('data');
    var datatexttype = document.getElementById('data-text-type');
    var datatextheading = document.getElementById('data-text-heading');
    var datamaintype = document.getElementById('data-main-type');
    var datamainheading = document.getElementById('data-main-heading');
    var datatextalt = document.getElementById('data-text-alt');
    var datatextswk = document.getElementById('data-text-swk');
    var datamainalt = document.getElementById('data-main-alt');
    var datamainswk = document.getElementById('data-main-swk');
    var datatextspd = document.getElementById('data-text-spd');
    var datatextplt = document.getElementById('data-text-plt');
    var datamainspd = document.getElementById('data-main-spd');
    var datamainplt = document.getElementById('data-main-plt');
    var route = document.getElementById('route');
    var routetitle = document.getElementById('route-title');
    var routemain = document.getElementById('route-main');
    var routecon = document.getElementById('route-con');

    title.style.display = "block";
    titpic.style.display = "block";
    img.style.display = "block";
    flight.style.display = "block";
    flighttextdep.style.display = "block";
    flighttextarr.style.display = "block";
    flighticon.style.display = "block";
    datamaintype.style.display = "block";
    dscallsign.style.display = "block";
    dscallsignmain.style.display = "block";
    data.style.display = "block";
    datatextalt.style.display = "block";
    datatextheading.style.display = "block";
    datatextplt.style.display = "block";
    datatextspd.style.display = "block";
    datatextswk.style.display = "block";
    datatexttype.style.display = "block";
    route.style.display = "block";
    routemain.style.display = "block";
    routetitle.style.display = "block";
    //传递html机组标牌信息
    flightmainarr.style.display = "block";
    flightmaindep.style.display = "block";
    routecon.style.display = "block";
    datamaintype.style.display = "block";
    datamainswk.style.display = "block";
    datamainspd.style.display = "block";
    datamainplt.style.display = "block";
    datamainheading.style.display = "block";
    datamainalt.style.display = "block";
    

    //


}
function ShowATCList() {
    var atctitle = document.getElementById('atctitle');
    var atcti = document.getElementById('atcti');
    var atctimain = document.getElementById('atcti-main');
    var atcdata = document.getElementById('atcdata');
    var atcdatatextcallsign = document.getElementById('atcdata-text-callsign');
    var atcdatatextcall = document.getElementById('atcdata-text-call');
    var atcdatamaincallsign = document.getElementById('atcdata-main-callsign');
    var atcdatamaincall = document.getElementById('atcdata-main-call');
    var atcdatatextcan = document.getElementById('atcdata-text-can');
    var atcdatatextrange = document.getElementById('atcdata-text-range');
    var atcdatamaincan = document.getElementById('atcdata-main-can');
    var atcdatamainrange = document.getElementById('atcdata-main-range');
    var atcdatatextrate = document.getElementById('atcdata-text-rate');
    var atcdatatextplt = document.getElementById('atcdata-text-plt');
    var atcdatamainrate = document.getElementById('atcdata-main-rate');
    var atcdatamainplt = document.getElementById('atcdata-main-plt');

    atcdata.style.display = "block";
    atcdatamaincall.style.display = 'block';
    atcdatamaincallsign.style.display = 'block';
    atcdatamaincan.style.display = 'block';
    atcdatamainplt.style.display = 'block';
    atcdatamainrange.style.display = 'block';
    atcdatamainrate.style.display = 'block';
    atcdatatextcall.style.display = 'block';
    atcdatatextcallsign.style.display = 'block';
    atcdatatextcan.style.display = 'block';
    atcdatatextplt.style.display = 'block';
    atcdatatextrange.style.display = 'block';
    atcdatatextrate.style.display = 'block';
    atcti.style.display = 'block';
    atctimain.style.display = 'block';
    atctitle.style.display = 'block';
}
