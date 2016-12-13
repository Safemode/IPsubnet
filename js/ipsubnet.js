// GitHub project ipsubnet
// Licensed under https://github.com/jmpep/ipsubnet/blob/master/LICENSE-MIT

var cookie_enable;

function onEnter(obj,e,check){
       var keycode =(window.event) ? event.keyCode : e.keyCode;
	   
       if (keycode == 13) //enter
       { obj.onchange(); }
};

function checkIP4format(txt) {
  var res,formataddr,i,ltxt;
  res = -1;
  formataddr = -1;
  // IP4
  ltxt = txt.split('.');
  if (ltxt.length>=4) {
    for (i=0;i<ltxt.length;i++) {
	  res = ltxt[i].search(/^[0-9]{1,3}$/);
	  if (res>=0) {
	  	if (parseInt(ltxt[i],10)>255) res = -1;
		else res = 0;
	  }
	  if (res<0) break;
    }
  }
  if (res>=0)  formataddr=1;
  return formataddr;
}

function checkIPformat(txt) {
  var res,formataddr,formataddr2,i,ltxt;
  res = -1;
  // IP4
  formataddr = checkIP4format(txt);
  if (formataddr<0) {
	// IPv6?
	ltxt = txt.split(':');
	if (ltxt.length>2) {
	 formataddr = 2;
     for (i=0;i<ltxt.length;i++) {
	  if (i==(ltxt.length-1)) {
		formataddr2 = checkIP4format(ltxt[i]);
	    formataddr3 = ltxt[i].search(/^([0-9]|[a-f]){1,4}$/i);
		res=2; 
		if (ltxt[i]!='') {
			if ((formataddr2<0)&&(formataddr3<0)) {
				res = -1;
		    } else {
	          if (formataddr2>=0) formataddr = 3;
		    }
		}
	  } else {
		if (ltxt[i]!='') {
	      res = ltxt[i].search(/^([0-9]|[a-f]){1,4}$/i);
		} else {
			res = 2;
		}
	  }
//console.log('checkIPformat '+i+'->'+ltxt[i]+' ->'+res);
	  if (res<0){
		  formataddr= -1
		  break;
	  }
     }
	}

  }
//console.log('checkIPformat ->'+formataddr);
  return formataddr;	
}

/*
txt='45.23.54.34';
console.log(txt+'->'+checkIPformat(txt));
txt='45.23.54.343333';
console.log(txt+'->'+checkIPformat(txt));
txt='45.23.5434';
console.log(txt+'->'+checkIPformat(txt));
txt='45.23.54,34';
console.log(txt+'->'+checkIPformat(txt));
txt='45.23.54.ab34';
console.log(txt+'->'+checkIPformat(txt));
txt='45.23.54.34.34';
console.log(txt+'->'+checkIPformat(txt));
txt='::1';
console.log(txt+'->'+checkIPformat(txt)+' expected 2');
txt='::1';
console.log(txt+'->'+checkIPformat(txt)+' expected 2');
txt='2001:abde:abcd:abcd:abcd:abce:abcd';
console.log(txt+'->'+checkIPformat(txt)+' expected 2');
txt=':4A2B::1F3F';
console.log(txt+'->'+checkIPformat(txt)+' expected 2');
txt='2002::123.45.67.89';
console.log(txt+'->'+checkIPformat(txt)+' expected 2');
txt='2001:abde:abcde:abcde:abcde:abce:abcde';
console.log(txt+'->'+checkIPformat(txt)+' expected -1');
txt='2001:abde:abcde:abcde:abcde:abce:abZZde';
console.log(txt+'->'+checkIPformat(txt)+' expected -1');
*/

function checkIP(obj,txt) {
	if (checkIPformat(txt)<0) {
		if (obj.className.indexOf(' has-warning' ) <0 ) {
		    obj.className = obj.className +' has-warning';
		}
	} else {
		obj.className = obj.className.replace(/\shas-warning/gi,'');
	}
}

function initializeValues(iptype,condense,ipval,nbrbits,mask,subnetval,broadcastval,hostfromval,hosttoval,hostsnbval,ipsnbval) {
  var IP = document.getElementById("IP");
  var bits = document.getElementById("bits");
  var subnet = document.getElementById("subnet");
  var broadcast = document.getElementById("broadcast");
  var hostfrom = document.getElementById("hostfrom");
  var hostto = document.getElementById("hostto");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var netmask = document.getElementById("netmask");
  var hostsnb = document.getElementById("hostsnb");
  var ipsnb = document.getElementById("ipsnb");
  var IPv6cchk = document.getElementById("IPv6cchk");
  var sectionbroadcast = document.getElementById("sectionbroadcast");
  /* the DOM variable above are for compatibility wit IE */
  if (condense==1) {  IPv6cchk.checked = true; }
  if (condense==0) {  IPv6cchk.checked = false; }
  if (iptype=='IPv4') {
	if (btIPv4.className.indexOf('active')<0) changeIPv4();
  } else {
      if ((btIPv6.className.indexOf('active')<0) && (btIPv6a.className.indexOf('active')<0)) changeIPv6();
  }
  if (iptype=='IPv4') {
    netmask.value=mask;
  } else {
    netmask.value=nbrbits;
  }
  IP.value =ipval.toUpperCase();
  bits.value=nbrbits;
  subnet.value=subnetval.toUpperCase();
  broadcast.value=broadcastval.toUpperCase();
  hostfrom.value=hostfromval.toUpperCase();
  hostto.value=hosttoval.toUpperCase();

  if (iptype=='IPv4') {
	  sectionbroadcast.style.display='inline';
	  netmask.style.visibility ='visible';
	  netmasklabel.style.visibility ='visible';	  
  } else {
	  sectionbroadcast.style.display='none';
	  netmask.style.visibility ='hidden';
	  netmasklabel.style.visibility ='hidden';	  
  }
  hostsnb.value=hostsnbval;
  ipsnb.value=ipsnbval;
  selecthostsnb.value=nbrbits;
  createselectSubnet();
  calculreversenetmaskval();
  fillinfotxtip();
}


function initializeFunctions() {
  // correction Bug all IE
  IP.onkeydown = function(e) {onEnter(IP,e,'');}
  IP.onkeyup   = function(e) {checkIP(IP,IP.value);}
  bits.onkeydown = function(e) {onEnter(bits,e,'');}
  subnet.onkeydown = function(e) {onEnter(subnet,e,'');}
  subnet.onkeyup   = function(e) {checkIP(subnet,subnet.value);}
  broadcast.onkeydown = function(e) {onEnter(broadcast,e,'');}
  hostfrom.onkeydown = function(e) {onEnter(hostfrom,e,'');}
  hostto.onkeydown = function(e) {onEnter(hostto,e,'');}
  btIPv4.onkeydown = function(e) {onEnter(btIPv4,e,'');}
  netmask.onkeydown = function(e) {onEnter(netmask,e,'');}
  hostsnb.onkeydown = function(e) {onEnter(hostsnb,e,'');}
  ipsnb.onkeydown = function(e) {onEnter(ipsnb,e,'');}
}

function initializeIPsubnet() {
  initializeValues('IPv4',-1,'192.168.0.10',24,'255.255.255.0','192.168.0.0','192.168.0.255','192.168.0.1','192.168.0.254',253,255)
  initializeFunctions();
//2001:0db8:85a3:08d3:1319:8a2e:0370:7344;
//2001:0db8:85a3:08d3:1319:8a2e:127.98.76.154;
  cookie_enable=(navigator.cookieEnabled == true);
  if (cookie_enable) {
    temp = getCookie('IPv4v6');
    if (temp=='') storeAllCookie();
    else getAllCookie();
  }
//  calculwithIPv6condensed(0);
//  calculwithIPv6alternative(0);
  changeInfo();
  calculreversenetmaskval();
}

function storeAllCookie() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var bits = document.getElementById("bits");
  var subnet = document.getElementById("subnet");
  var broadcast = document.getElementById("broadcast");
  var hostfrom = document.getElementById("hostfrom");
  var hostto = document.getElementById("hostto");
  var netmask = document.getElementById("netmask");
  var hostsnb = document.getElementById("hostsnb");
  var ipsnb = document.getElementById("ipsnb");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var lang;
  if (cookie_enable) {
   var days = 60;
   if (btIPv4.className.indexOf('active')>=0) {
     setCookie('IPv4v6','IPv4',days);
   } else if (btIPv6.className.indexOf('active')>=0) {
     setCookie('IPv4v6','IPv6',days);
   } else if (btIPv6a.className.indexOf('active')>=0) {
     setCookie('IPv4v6','IPv6a',days);
   } else {
     setCookie('IPv4v6','default',days);
   }
   if (IPv6cchk.checked) {
     setCookie('IPv6cchk','1',days);
   } else {
     setCookie('IPv6cchk','0',days);  
   }
   setCookie('IP',IP.value,days);
   setCookie('bits',bits.value,days);
   setCookie('netmask',netmask.value,days);
   setCookie('subnet',subnet.value,days);
   setCookie('broadcast',broadcast.value,days);
   setCookie('hostfrom',hostfrom.value,days);
   setCookie('hostto',hostto.value,days);
   setCookie('hostsnb',hostsnb.value,days);
   setCookie('ipsnb',ipsnb.value,days);
   var lang= imglanguage.className.replace('imglanguage','').trim();
   setCookie('lang',lang,days);
   if (istoggledPanel('collapse1')==1) {   setCookie('collapse1',1,days); } else {   setCookie('collapse1',0,days); }
   if (istoggledPanel('collapse2')==1) {   setCookie('collapse2',1,days); } else {   setCookie('collapse2',0,days); }
   if (istoggledPanel('collapse3')==1) {   setCookie('collapse3',1,days); } else {   setCookie('collapse3',0,days); }
   if (istoggledPanel('collapse4')==1) {   setCookie('collapse4',1,days); } else {   setCookie('collapse4',0,days); }
  }
}

function getAllCookie() {
  var IP = document.getElementById("IP");
  var bits = document.getElementById("bits");
  var subnet = document.getElementById("subnet");
  var broadcast = document.getElementById("broadcast");
  var hostfrom = document.getElementById("hostfrom");
  var hostto = document.getElementById("hostto");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var netmask = document.getElementById("netmask");
  var hostsnb = document.getElementById("hostsnb");
  var ipsnb = document.getElementById("ipsnb");
  var IPv6cchk = document.getElementById("IPv6cchk");
  var imglanguage = document.getElementById("imglanguage");
  /* the DOM variable above are for compatibility wit IE */
  var ipid,ipidlist; 
  if (cookie_enable) {
    IP.value = getCookie('IP');
	ipid=getCookie('IPv4v6');
	btIPv4.className = btIPv4.className.replace('active','');
	btIPv6.className = btIPv6.className.replace('active','');
	btIPv6a.className = btIPv6a.className.replace('active','');
	switch (ipid) {
		case 'IPv4': btIPv4.className = 'active '+btIPv4.className; break;
		case 'IPv6': btIPv6.className = 'active '+btIPv6.className; break;
		case 'IPv6a': btIPv6a.className = 'active '+btIPv6a.className; break;
		default:  btIPv4.className = 'active '+btIPv4.className;
	}
    IP.value= getCookie('IP');
    bits.value= getCookie('bits');
    netmask.value= getCookie('netmask');
    subnet.value= getCookie('subnet');
    broadcast.value= getCookie('broadcast');
    hostfrom.value= getCookie('hostfrom');
    hostto.value= getCookie('hostto');
    hostsnb.value= getCookie('hostsnb');
    ipsnb.value= getCookie('ipsnb');
    if (getCookie('IPv6cchk')=='1') {
      IPv6cchk.checked = true;
    } else {
      IPv6cchk.checked = false;
    }
    if (getCookie('collapse1')=='1') {   settoggledPanel('collapse1',1); } else {  settoggledPanel('collapse1',0); }
    if (getCookie('collapse2')=='1') {   settoggledPanel('collapse2',1); } else {  settoggledPanel('collapse2',0); }
    if (getCookie('collapse3')=='1') {   settoggledPanel('collapse3',1); } else {  settoggledPanel('collapse3',0); }
    if (getCookie('collapse4')=='1') {   settoggledPanel('collapse4',1); } else {  settoggledPanel('collapse4',0); }
    lang= getCookie('lang');
	setlanguageObjects(lang);
  }
}

function setCookie(cname, cvalue, days) {
    var exp,expiration = new Date();
    expiration.setTime(expiration.getTime() + (days * 24 * 60 * 60 * 1000));
    exp = '; expires=' + expiration.toGMTString();
    document.cookie = cname + '=' + encodeURI(cvalue) + ';';
}

function getCookie(cname) {
    var name = cname,value='';
    var cook = document.cookie.split(';');
    for(var i = 0; i <cook.length; i++) {
		var pos = cook[i].indexOf(cname+'=');
        if (pos>=0) {
           val = cook[i].split('=');
		   value= decodeURI(val[1]);
           break;
		}
    }
    return value;
}
// -------------------------------------------
// find How many semicolon and return the 
// last position
function OLDHowmanysemicolon(val,last) {
  var indx,fromindex=0,j=0;
  lg=val.length;
  fromindex=0;
  while (j<lg) {
     indx=val.indexOf(":",fromindex);
     if (indx<0) break;
     fromindex=indx+1;
     j++;
  }
  last[0]= fromindex-1;
  return j;
}

// -----------------------------------------
// find the version and return each part
//   IP value in textformat
//   tpart is array of the each part of the IP, filled in all cases
//   tpartip4 is Array(4) for each part of the ip4
//   infoip is Array(2)
//      where infoip[0] is IP type (ip4,ip6,ip6alt,ip6cond)
//        and infoip[1] errornumber
//                         = 0    is no error
//                         <-1000 is error on the number of part with '.'
//                         > 1000 is error of a number in the IP
//
function extractIPformat(val,tpart,tpartip4) {
  var tpartip4txt = new Array(4);  
  var tparttxt = new Array(8);
  var tparttxt2 = new Array(2);
  var typeIP;

  tparttxt[0]=tparttxt[1]=tparttxt[2]=tparttxt[3]=tparttxt[4]=tparttxt[5]=tparttxt[6]=tparttxt[7]='0';
  tpart[0]=tpart[1]=tpart[2]=tpart[3]=tpart[4]=tpart[5]=tpart[6]=tpart[7]=0;
  //IPv4 or IPv6 alternative 
  tpartip4txt[0]=tpartip4txt[1]=tpartip4txt[2]=tpartip4txt[3]='0';
  tpartip4[0]=tpartip4[1]=tpartip4[2]=tpartip4[3]=0;
  typeIP=checkIPformat(val);
  if (typeIP>=0) {
	  switch (typeIP) {
		  case 1: {
			  tpartip4 = val.split('.');
//console.log('extractIPformat -> ='+tpartip4);
			  tparttxt[6]=(tpartip4[0]*256+tpartip4[1]*1).toString(16);
			  tparttxt[7]=(tpartip4[2]*256+tpartip4[3]*1).toString(16);
			  break;
		  }
		  case 2: {
			  val = expended(val);
			  tparttxt = val.split(':');
			  break;
		  }
		  case 3: {
			  val = expended(val);
			  tparttxt = val.split(':');
			  tpartip4 = tparttxt[6].split('.');
			  tparttxt[6]=(tpartip4[0]*256+tpartip4[1]*1).toString(16);
			  tparttxt[7]=(tpartip4[2]*256+tpartip4[3]*1).toString(16);
			  break;
		  }
	  }
	  for (var i=0;i<8;i++) { tpart[i]=parseInt(tparttxt[i],16); }
  }
//console.log('extractIPformat -> typeIP='+typeIP+' ='+tparttxt);
  return typeIP;
}
function OLDextractIPformat(val,tpart,tpartip4,tinfoip) {
  var lg,j;
  var iserror=0;
  var fromindex,indx,nbsemi=0,nbsemicolonmax=0;
  var lastsemi= new Array(1);
  var ipv4;
  var tpartip4txt = new Array(4);  
  var tparttxt = new Array(8);
  var tparttxt2 = new Array(2);
  var typeIP,ip_type,iptype,condensed;

  ip_type='ip4';
  tparttxt[0]=tparttxt[1]=tparttxt[2]=tparttxt[3]=tparttxt[4]=tparttxt[5]=tparttxt[6]=tparttxt[7]='0';
  tpart[0]=tpart[1]=tpart[2]=tpart[3]=tpart[4]=tpart[5]=tpart[6]=tpart[7]=0;
  if ((nbsemi=Howmanysemicolon(val,lastsemi))>0) ip_type='ip6';
  iptype=ip_type;
  //IPv4 or IPv6 alternative 
  tpartip4txt[0]=tpartip4txt[1]=tpartip4txt[2]=tpartip4txt[3]='0';
  tpartip4[0]=tpartip4[1]=tpartip4[2]=tpartip4[3]=0;
  typeIP=checkIPformat(val);
  if (typeIP<0) {
	  // error
  }
  if (val.indexOf(".")>0) {
      // either IPv4 or IPv6 alternative
      if (ip_type=='ip6') {
        iptype='ip6alt';
        // search the alternative part
        ipv4=val.substring(lastsemi[0]+1,val.length);
      } else {
        ipv4=val;
      }
      lg=ipv4.length;
      fromindex=0;
      j=0;
      for (var i=0; i<lg;) {
         indx=ipv4.indexOf(".",fromindex);
         if (indx<0) {
           tpartip4txt[j]=ipv4.substring(fromindex,lg);
           j++;
           break;
         } else tpartip4txt[j]=ipv4.substring(fromindex,indx);
         i=indx+1;
         fromindex=indx+1;
         j++;
      }
      for (var i=0;i<4;i++) tpartip4[i]=parseInt(tpartip4txt[i],10);
      if (j<3) iserror=-j-1001;
      for (var i=0; i<4; i++) if ((tpartip4[i]<0)|(tpartip4[i]>255)|(isNaN(tpartip4[i]))) iserror=i+1001;
      tparttxt[6]=tparttxt2[0]=(tpartip4[0]*256+tpartip4[1]*1).toString(16);
      tparttxt[7]=tparttxt2[1]=(tpartip4[2]*256+tpartip4[3]*1).toString(16);
  }
  if (!iserror) {
    if (ip_type!=='ip4') {
	// treat the IPv6 addresses
	nbsemicolonmax= (ip_type=='ip6') ? ((iptype=='ip6alt')?6:7) : 6;
	// replace the missing :
	condensed=val.match("::");
	if (condensed) {
	   val = expended(val);
	}
	
	// search all IPv6 parts
	fromindex= 0;
	lg= val.length;
	j=0;
	while (j<(nbsemicolonmax+1)) {
	  var iptemp;
	  indx=val.indexOf(":",fromindex);
          if (indx<0) {
             if (ip_type=='ip6') {
               iptemp=val.substring(fromindex,lg);
               if (iptemp!=='') tparttxt[j] = iptemp;
             }
             j++;
             break;
           } else {
             tparttxt[j] =val.substring(fromindex,indx);
             j++;
           }
	  i=indx+1;
	  fromindex=indx+1;
	}
	// replace the alternative part
	if (iptype=='ip6alt') {
		tparttxt[6]=tparttxt2[0];
		tparttxt[7]=tparttxt2[1];
	}
	if (condensed)
	  if (iptype=='ip6alt') iptype='ip6altcond';
	  else iptype='ip6cond';
    }
  }
  for (var i=0;i<8;i++) { tpart[i]=parseInt(tparttxt[i],16); if (tpart[i]>65535) iserror=i+1;}
  tinfoip[0]= iptype;
  tinfoip[1]= iserror;
  return (typeIP);
}

function checkIPaddress(val,part) {
  var partip4 = new Array(4);  
  var typeIP;
  
  // conversion in IPv6
  typeIP=extractIPformat(val,part,partip4);
  if (typeIP<0) alert('Error in the IP:'+val);
  return typeIP;
}

function condenseOLD(txt) {
  var tnullbegin = new Array(10);  
  var tnullto    = new Array(10);
  var nullindx=-1,pres=0,j=-1;
  rtrtxt= txt;
  for (var i=0, indx=0;i<txt.length;) {
          indx=txt.indexOf(":0:",i);
          if (indx<0) break;
          else {
		if (pres!==(indx-2)) {
		  nullindx++;
   	  tnullbegin[nullindx]=indx;
		  tnullto[nullindx]=indx;
		}
		else tnullto[nullindx]=indx;
          	pres=indx;
          }
          i=indx+1;
  }
  for (var i=0, avant=0; i<=nullindx;i++) {
    if (j==-1) { j=i ; avant=i; }
    else if ((tnullto[avant]-tnullbegin[avant])>(tnullto[i]-tnullbegin[i])) { avant=i;j=i;}
  }
  if (j>=0) {
    rtrtxt= txt.replace(txt.substring(tnullbegin[j],tnullto[j]+2),':');
  }
  return rtrtxt;
}

function condense(txt) {
  var rtrtxt,ltxt,stillmax,cons;
  var c,max,pos,posbeg,posend,posmaxbeg,posmaxend;
  var i,s1,rtrtxt2;
  //compressing leading 0
  rtrtxt= txt.replace(/:0000/ig,':0');
  rtrtxt= rtrtxt.replace(/:000/ig,':0');
  rtrtxt= rtrtxt.replace(/:00/ig,':0');
  rtrtxt= rtrtxt.replace(/:0000:/ig,':0:');
  rtrtxt= rtrtxt.replace(/:000:/ig,':0:');
  rtrtxt= rtrtxt.replace(/:00:/ig,':0:');
  rtrtxt= rtrtxt.replace(/^0000:/ig,'0:');
  rtrtxt= rtrtxt.replace(/^000:/ig,'0:');
  rtrtxt= rtrtxt.replace(/^00:/ig,'0:');
  // :: can be used only one time
  //check from the left
  rtrtxt2= rtrtxt.replace(/:0:0:0:0:0:0:0/,'::');
  if (rtrtxt2!=rtrtxt) {
	  rtrtxt = rtrtxt2;
  } else {
    rtrtxt2= rtrtxt.replace(/:0:0:0:0:0:0:/,'::');
    if (rtrtxt2!=rtrtxt) {
  	  rtrtxt = rtrtxt2;
    } else {
      rtrtxt2= rtrtxt.replace(/:0:0:0:0:0:/,'::');
      if (rtrtxt2!=rtrtxt) {
    	  rtrtxt = rtrtxt2;
      } else {
        rtrtxt2= rtrtxt.replace(/:0:0:0:0:/,'::');
        if (rtrtxt2!=rtrtxt) {
      	  rtrtxt = rtrtxt2;
        } else {
          rtrtxt2= rtrtxt.replace(/:0:0:0:/,'::');
          if (rtrtxt2!=rtrtxt) {
        	  rtrtxt = rtrtxt2;
          } else {
            rtrtxt2= rtrtxt.replace(/:0:0:/,'::');
            if (rtrtxt2!=rtrtxt) {
          	  rtrtxt = rtrtxt2;
            }
    	  }
  	    }
	  }
    }	  
  }
  if (rtrtxt.substring(0,3)=='0::') {
	  rtrtxt= rtrtxt.replace('0::','::');
  }
  return rtrtxt;
}

function expended(txt) {
  var rtrtxt= txt;
  var i,nbp,nbs,ext,missing;
  nbp= (txt.match(/\./g)|| []).length;
  nbs= (txt.match(/:/g)|| []).length;

  if (nbp>1) {ext= 1;} else {ext =0;}
  if (nbs<(8-ext))  {
	  missing= ':';
	  for (i=0;i<(8-nbs-ext);i++) {
		  missing= missing + '0:';
	  }
	  rtrtxt=rtrtxt.replace(/::/,missing);
  }
  if (rtrtxt.substring(0,1)==':') { rtrtxt='0'+rtrtxt; }
  if (rtrtxt.substring(rtrtxt.length,rtrtxt.length-1)==':') { rtrtxt=rtrtxt+'0'; }
  return rtrtxt;
}

function showNumberInBin(val){
	var masktxt='';
	masktxt=val[0].toString(2)+':'+val[1].toString(2)+':'+val[2].toString(2)+':'+val[3].toString(2)+':'
	       +val[4].toString(2)+':'+val[5].toString(2)+':'+val[6].toString(2)+':'+val[7].toString(2);
	 return masktxt;
}

function showIPInv4(tip){
	var val='';
   var temp1,temp2,temp3,temp4;
   temp1= tip[6]>>8;
   temp2= tip[6] & 255;
   temp3= tip[7]>>8;
   temp4= tip[7] & 255;
	val = temp1+'.'+temp2+'.'+temp3+'.'+temp4;
	return val;
}

function showIPInHex(type,tip){
	var masktxt='',extension;
	if (type.indexOf('a')>=0) {
	  extension = showIPInv4(tip);
	} else {
	  extension = tip[6].toString(16)+':'+tip[7].toString(16);
	}
	masktxt=tip[0].toString(16)+':'+tip[1].toString(16)+':'+tip[2].toString(16)
 	   +':'+tip[3].toString(16)+':'+tip[4].toString(16)+':'+tip[5].toString(16)
	   +':'+extension;
	if (type.indexOf('c')>=0) masktxt= condense(masktxt);
	return masktxt.toUpperCase();
}

function transformIPtotxt(ipversion,tip) {
  var txt='';
  if (ipversion=='v4') {
 	  txt= showIPInv4(tip);
 	}
    else {
	  txt =showIPInHex(ipversion,tip)
   }
  return txt;
}

function changeSubnet() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var bits = document.getElementById("bits");
  var IPv6cchk = document.getElementById("IPv6cchk");
  var subnet = document.getElementById("subnet");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var valbin= new Array(8);
  var valbintxt= new Array(8);
  var subnetval= new Array(8);
  var nbbits,ipversion,ipval;

  ipversion = 'v4';
  if (btIPv6.className.indexOf('active')>=0)  ipversion='v6';
  if (btIPv6a.className.indexOf('active')>=0) ipversion='v6a';
  if ((ipversion.indexOf('v6')>=0) && (IPv6cchk.checked)) ipversion=ipversion+'c';
  //if (btIPv6c.className.indexOf('active')>=0) ipversion='v6c';
  // calcul de l'IP dans le format ipv6
  ipval=IP.value;
  error=checkIPaddress(ipval,retval);
  // calcul du mask
  valbintxt[0]=valbintxt[1]=valbintxt[2]=valbintxt[3]='';
  valbintxt[4]=valbintxt[5]=valbintxt[6]=valbintxt[7]='';
  bitszone=96;
  nbbits=(ipversion=='v4')? (parseInt(bits.value,10)+bitszone):parseInt(bits.value,10);
  for (var i=0,j=0,k=0; i<128; i++) {
      if (i<nbbits) {
         valbintxt[j]=valbintxt[j]+'1';
      } else {
        valbintxt[j]=valbintxt[j]+'0';
      }
      k++;
      if (k>15) { j++; k=0;}
  }
  for (var i=0;i<8;i++) valbin[i]=parseInt(valbintxt[i],2);
  if (error>=0) {
    for (var i=0;i<8;i++) {
        subnetval[i]= retval[i] & valbin[i];
    }    
    subnet.value= transformIPtotxt(ipversion,subnetval);
  }
}

function calculMaskIPv4(nbbits) {
  var valbin,masktxt;
  if (nbbits<1) nbbits=1;
  valbin='';
  for (var i=0; i<32; ++i) {
      if (i<nbbits) valbin =valbin+'1'; else valbin=valbin+'0';
  }
  masktxt=''+parseInt(valbin.substring(0,8),2)+'.'+parseInt(valbin.substring(8,16),2)+'.'
    	 +parseInt(valbin.substring(16,24),2)+'.'+parseInt(valbin.substring(24,32),2);
  return masktxt;
}

function calculeMaskBits()
{
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  var netmask = document.getElementById("netmask");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var valmask,maxbits,minbits,valbits,ipval;
  
  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  valbits=bits.value;
  if (ipversionv4) {
     ipval=IP.value;
     error=checkIPaddress(ipval,retval);
     if (error>=0) {
      if (retval[6]<0x8000) minbits=3; 
       else if ((0x7fff<retval[6]) & (retval[6]< 0xc000)) minbits=8;
        else if ((0xbfff<retval[6]) & (retval[6]< 0xe000)) minbits=16; 
           else minbits=3;
      } else minbits=3;
   }
   else {
    ipval=IP.value;
    error=checkIPaddress(ipval,retval);
    if (error>=0) {
       if (retval[0]<2) minbits=128; // Unspecified & Loopback
       else if ((8191<retval[0]) & (retval[0]<8194)) minbits=16; // internet
        else if (retval[0]==65280) minbits=8; // Multicast
          else if ((retval[0]==65152) || (retval[0]==65216)) minbits=10; // Link-local unicast & Site-local unicast
           else minbits=3;
      } else minbits=3;
   }
  if (valbits<minbits) valbits=minbits;
  if (ipversionv4) maxbits=32; else maxbits=128;
  if (valbits>maxbits) valbits=maxbits;
  bits.value=valbits;
  valmasktxt= calculMaskIPv4(valbits);
  if (ipversionv4) {
	  netmask.value= valmasktxt;
  } else {
	  netmask.value= bits.value;
  }
}

function bitsToHostsnb() {
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  var hostsnb = document.getElementById("hostsnb");
  var selecthostsnb = document.getElementById("selecthostsnb");
  /* the DOM variable above are for compatibility wit IE */
  var maxhost;
  var ipversionv4,nbrbits;

  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  nbrbits= (ipversionv4) ? 32-bits.value: 128-bits.value;
  maxhost=Math.pow(2,nbrbits)-2;
  if (maxhost<1) maxhost=1;
  hostsnb.value=maxhost;
  selecthostsnb.value=maxhost+2;
}

function hostsnbToBits() {
  var btIPv4 = document.getElementById("btIPv4");
  var selecthostsnb = document.getElementById("selecthostsnb");
  var bits = document.getElementById("bits");
  /* the DOM variable above are for compatibility wit IE */
  var ipversionv4,maxhost,nbr,hostsnb,nbrbits,nbrbitshosts;
  var maxhostipv6;
  
  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  maxhostipv6=Math.pow(2,120); // en fait depends de l'IP
  maxhost=(ipversionv4)?(4294967296):maxhostipv6;
  h=1;if (selecthostsnb.value>2) h=(selecthostsnb.value-2);
  nbr=Math.floor(2+(parseInt(h,10))/2)*2; // devient un multiple de deux
  if (nbr<1) nbr=1;
  if (nbr>maxhost) nbr=maxhost;
  nbrbitshosts=Math.floor(Math.log(nbr+2)/Math.log(2));
  nbrbits=(ipversionv4)?(32-nbrbitshosts):(64-nbrbitshosts);
  bits.value= nbrbits;
  bitsToHostsnb();  // peut-etre n'etait pas une puissance de deux
  fillinfotxtip();
}

function bitsToIPsnb() {
  var btIPv4 = document.getElementById("btIPv4");
  var ipsnb = document.getElementById("ipsnb");
  var bits = document.getElementById("bits");
  /* the DOM variable above are for compatibility wit IE */
  var maxips;
  var ipversionv4;

  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  nbrbits= (ipversionv4) ? 32-bits.value: 128-bits.value;
  maxips=Math.pow(2,nbrbits);
  ipsnb.value=maxips;
}

function ipsnbToBits() {
  var btIPv4 = document.getElementById("btIPv4");
  var ipsnb = document.getElementById("ipsnb");
  var bits = document.getElementById("bits");
  /* the DOM variable above are for compatibility wit IE */
  var ipversionv4,maxips,nbr,hostsnb,nbrbits,nbrbitsips;
  var maxhostipv6;
  
  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  maxhostipv6=Math.pow(2,120); // en fait depends de l'IP
  maxhost=(ipversionv4)?(4294967296):maxhostipv6;
  nbr=Math.floor((parseInt(ipsnb.value,10))/2)*2;
  if (nbr<1) nbr=1;
  if (nbr>maxips) nbr=maxips;
  nbrbitsips=Math.floor(Math.log(nbr+2)/Math.log(2));
  nbrbits=(ipversionv4)?(32-nbrbitsips):(64-nbrbitsips);
  bits.value= nbrbits;
  bitsToIPsnb();  // peut-etre n'etait pas une puissance de deux
}

function getBroadcast() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var bits = document.getElementById("bits");
  var broadcast = document.getElementById("broadcast");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var valbin= new Array(8);
  var valbintxt= new Array(8);
  var tbroadcast= new Array(8);
  var ipversion,nbbits,broadcasttxt;

  ipversion = 'v4';
  if (btIPv6.className.indexOf('active')>=0)  ipversion='v6';
  if (btIPv6a.className.indexOf('active')>=0) ipversion='v6a';
  if ((ipversion.indexOf('v6')>=0) && (IPv6cchk.checked)) ipversion=ipversion+'c';
  valbintxt[0]=valbintxt[1]=valbintxt[2]=valbintxt[3]='';
  valbintxt[4]=valbintxt[5]=valbintxt[6]=valbintxt[7]='';
  bitszone=96;
  nbbits=(ipversion=='v4')? (parseInt(bits.value,10)+bitszone):parseInt(bits.value,bitszone);
  for (var i=0,j=0,k=0; i<128; i++) {
      if (i<nbbits) {
         valbintxt[j]=valbintxt[j]+'0';
      } else {
        valbintxt[j]=valbintxt[j]+'1';
      }
      k++;
      if (k>15) { j++; k=0;}
  }
  for (var i=0;i<8;i++) valbin[i]=parseInt(valbintxt[i],2);
  ipval= IP.value;
  error= checkIPaddress(ipval,retval);
  if (error>=0) {
	if (ipversion=='v4') {
      for (var i=0;i<8;i++) {
          tbroadcast[i]= retval[i] | valbin[i];
      }
      tbroadcast[0]= 65280; // no broadcast in IPv6, broadcast is a multicast FF00
      broadcasttxt=transformIPtotxt(ipversion,tbroadcast);
      broadcast.value= broadcasttxt;
	} else {
	  broadcast.value= 'FF01::1';
	}
  }
}

function getHostfrom() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var subnet = document.getElementById("subnet");
  var hostfrom = document.getElementById("hostfrom");
  var bits = document.getElementById("bits");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var valbin= new Array(8);
  var thostfrom= new Array(8);
  var ipversion,nbbits,hostfromtxt,subnetval;

  ipversion = 'v4';
  if (btIPv6.className.indexOf('active')>=0)  ipversion='v6';
  if (btIPv6a.className.indexOf('active')>=0) ipversion='v6a';
  if ((ipversion.indexOf('v6')>=0) && (IPv6cchk.checked)) ipversion=ipversion+'c';
  //if (btIPv6c.className.indexOf('active')>=0) ipversion='v6c';
  valbin = [ 0, 0, 0, 0, 0, 0, 0, 1 ];
  subnetval= subnet.value;
  error= checkIPaddress(subnetval,retval);
  if (error>=0) {
	if ( ((ipversion == 'v4') && (bits.value=='32')) || ((ipversion != 'v4') && (bits.value=='128'))) {
		thostfrom= retval;
	} else {
      for (var i=0;i<8;i++) {
        thostfrom[i]= retval[i] | valbin[i];
      }
	}
   hostfromtxt=transformIPtotxt(ipversion,thostfrom);
   hostfrom.value= hostfromtxt;
  }
}

function getHostTo() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var bits = document.getElementById("bits");
  var subnet = document.getElementById("subnet");
  var hostto = document.getElementById("hostto");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var valbin= new Array(8);
  var valbintxt= new Array(8);
  var thostto= new Array(8);
  var ipversion,nbbits,hosttotxt,valsubnet;

  ipversion = 'v4';
  if (btIPv6.className.indexOf('active')>=0)  ipversion='v6';
  if (btIPv6a.className.indexOf('active')>=0) ipversion='v6a';
  if ((ipversion.indexOf('v6')>=0) && (IPv6cchk.checked)) ipversion=ipversion+'c';
  //if (btIPv6c.className.indexOf('active')>=0) ipversion='v6c';
  valbintxt[0]=valbintxt[1]=valbintxt[2]=valbintxt[3]='';
  valbintxt[4]=valbintxt[5]=valbintxt[6]=valbintxt[7]='';
  bitszone=96;
  nbbits=(ipversion=='v4')? (parseInt(bits.value,10)+bitszone):parseInt(bits.value,10);
  for (var i=0,j=0,k=0; i<128; i++) {
      if (i<nbbits) {
         valbintxt[j]=valbintxt[j]+'0';
      } else {
        if (i==127) valbintxt[j]=valbintxt[j]+'0';
          else valbintxt[j]=valbintxt[j]+'1';
      }
      k++;
      if (k>15) { j++; k=0;}
  }
  for (var i=0;i<8;i++) valbin[i]=parseInt(valbintxt[i],2);
  valsubnet= subnet.value;
  error= checkIPaddress(valsubnet,retval);
  if (error>=0) {
    for (var i=0;i<8;i++) {
        thostto[i]= retval[i] | valbin[i];
    }
    hosttotxt=transformIPtotxt(ipversion,thostto);
    hostto.value= hosttotxt;
  }
}

function subnetToIP() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var bits = document.getElementById("bits");
  var subnet = document.getElementById("subnet");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var retvalsub= new Array(8);
  var retvalip= new Array(8);
  var newvalip= [0,0,0,0,0,0,0,0];
  var newvalsub= [0,0,0,0,0,0,0,0];
  var valbin= [0,0,0,0,0,0,0,0];
  var valbintxt= ['','','','','','','',''];
  var valbinsub= [0,0,0,0,0,0,0,0];
  var valbinsubtxt= ['','','','','','','',''];
  var valsub,valip,valiptxt,nbbits,error,error2;
  var ipversion;
  
  ipversion = 'v4';
  if (btIPv6.className.indexOf('active')>=0)  ipversion='v6';
  if (btIPv6a.className.indexOf('active')>=0) ipversion='v6a';
  if ((ipversion.indexOf('v6')>=0) && (IPv6cchk.checked)) ipversion=ipversion+'c';
  //if (btIPv6c.className.indexOf('active')>=0) ipversion='v6c';
  valsub= subnet.value;
  error=checkIPaddress(valsub,retvalsub);
  valip = IP.value;
  error2=checkIPaddress(valip,retvalip);
  bitszone=96;
  nbbits=(ipversion=='v4')? (parseInt(bits.value,10)+bitszone):parseInt(bits.value,10);
  for (var i=0,j=0,k=0; i<128; i++) {
      if (i<nbbits) {
        valbintxt[j]=valbintxt[j]+'0';
      } else {
        valbintxt[j]=valbintxt[j]+'1';
      }
      k++;
      if (k>15) { j++; k=0;}
  }
  for (var i=0,j=0,k=0; i<128; i++) {
      if (i<nbbits) {
        valbinsubtxt[j]=valbinsubtxt[j]+'1';
      } else {
        valbinsubtxt[j]=valbinsubtxt[j]+'0';
      }
      k++;
      if (k>15) { j++; k=0;}
  }
  for (var i=0;i<8;i++) valbin[i]=parseInt(valbintxt[i],2);
  for (var i=0;i<8;i++) valbinsub[i]=parseInt(valbinsubtxt[i],2);
  if (error>=0) {
    for (var i=0;i<8;i++) {
        // prend la partie hosts
        newvalip[i]= retvalip[i] & valbin[i];
        // rajoute le subnet
        newvalip[i]= retvalsub[i] | newvalip[i];
    }
    valiptxt=transformIPtotxt(ipversion,newvalip);
    IP.value= valiptxt;
	// Verifiy the submitted subnet
    for (var i=0;i<8;i++) {
        // prend la partie hosts
        newvalsub[i]= retvalsub[i] & valbinsub[i];
        // rajoute le subnet
        //newvalsub[i]= retvalsub[i] & newvalip[i];
    }
    valiptxt=transformIPtotxt(ipversion,newvalsub);
    subnet.value= valiptxt;
  }
}

function subnetToNbbits() {
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  var netmask = document.getElementById("netmask");
  var selecthostsnb = document.getElementById("selecthostsnb");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var val,error,nbrbitshosts,nbrbits;
  
  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  if (ipversionv4) {
   val= netmask.value;
   error=checkIPaddress(val,retval);
   nbrbitshosts=0;
   for (var i=7; i>6; i--) {
    var a=retval[i],b;
    b= a.toString(2);
    for (j=b.length-1;j>0;j--)
      if (b.charAt(j)=='0') nbrbitshosts++;
      else {
        i=-1; // to stop
        // check the mask        
        break;
      }
   }
   nbrbits=(ipversionv4)?(32-nbrbitshosts):(128-nbrbitshosts);
   if (nbrbits<=0) nbrbits=1;
   bits.value= nbrbits;
  }
}

function addIP(direction) {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var tnewip= new Array(8);
  var newiptxt,ipval,ipversion;
  var valbin = [ 0, 0, 0, 0, 0, 0, 0, 1 ];
  var error;
  ipversion = 'v4';
  if (btIPv6.className.indexOf('active')>=0)  ipversion='v6';
  if (btIPv6a.className.indexOf('active')>=0) ipversion='v6a';
  if ((ipversion.indexOf('v6')>=0) && (IPv6cchk.checked)) ipversion=ipversion+'c';
  ipval= expended(IP.value);
  error= checkIPaddress(ipval,retval);
  if (error>=0) {
    var retenue=0;
    if (direction=='-1') {
      for (var i=7;0<=i;i--) {
        if (retval[i]<(valbin[i]+retenue)) {
		  tnewip[i]= 0xFFFF - valbin[i]-retenue+1;
		  retenue=1;
		} else {
          tnewip[i]= retval[i] - valbin[i] - retenue;
		  retenue=0;
		}
      }
    } else {
      for (var i=7;0<=i;i--) {
        tnewip[i]= retval[i] + valbin[i] + retenue;
        if (tnewip[i]>0xFFFF) { tnewip[i]=0; retenue=1; }
        else retenue=0;
      }
    }
    newiptxt=transformIPtotxt(ipversion,tnewip);
	if (IPv6cchk.checked) newiptxt= condense(newiptxt);
    IP.value= newiptxt;
  }
}

function range(direction) {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var bits = document.getElementById("bits");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var valbin= new Array(8);
  var valbintxt= new Array(8);
  var tnewip= new Array(8);
  var ipversion,nbbits,newiptxt;

  ipversion = 'v4';
  if (btIPv6.className.indexOf('active')>=0)  ipversion='v6';
  if (btIPv6a.className.indexOf('active')>=0) ipversion='v6a';
  if ((ipversion.indexOf('v6')>=0) && (IPv6cchk.checked)) ipversion=ipversion+'c';
  //if (btIPv6c.className.indexOf('active')>=0) ipversion='v6c';
  valbintxt[0]=valbintxt[1]=valbintxt[2]=valbintxt[3]='';
  valbintxt[4]=valbintxt[5]=valbintxt[6]=valbintxt[7]='';
  bitszone=96;
  nbbits=(ipversion=='v4')? (parseInt(bits.value,10)+bitszone):(parseInt(bits.value,10));
  for (var i=1,j=0,k=0; i<=128; i++) {
      if (nbbits==i) {
         valbintxt[j]=valbintxt[j]+'1';
      } else {
        valbintxt[j]=valbintxt[j]+'0';
      }
      k++;
      if (k>15) { j++; k=0;}
  }
  for (var i=0;i<8;i++) valbin[i]=parseInt(valbintxt[i],2);
  ipval= IP.value;
  error= checkIPaddress(ipval,retval);
  if (error>=0) {
    var retenue=0;
    if (direction=='-1') {
      for (var i=0;i<8;i++) {
        tnewip[i]= retval[i] - valbin[i] - retenue;
        if (tnewip[i]<0) { tnewip[i]=0; retenue=32768; }
        else retenue=0;
      }
    } else {
      for (var i=7;0<=i;i--) {
        tnewip[i]= retval[i] + valbin[i] + retenue;
        if (tnewip[i]>65535) { tnewip[i]=0; retenue=1; }
        else retenue=0;
      }
    }
    newiptxt=transformIPtotxt(ipversion,tnewip);
    IP.value= newiptxt;
  }
  fillinfotxtip();
}

function calculmaskval() {
  var btIPv4 = document.getElementById("btIPv4");
  var netmask = document.getElementById("netmask");
  /* the DOM variable above are for compatibility wit IE */
  if (btIPv4.className.indexOf('active')>=0) {
	calculsubnetmaskval();
  } else {
	bits.value=netmask.value;
	calculeBits();
  }
  calculreversenetmaskval();
}
function inversionnetmask(mask) {
	var lval;
	lval= mask.split('.');
	val1=255-parseInt(lval[0],10);
	val= ''+val1;
	for (i=1; i<lval.length;i++) {
		val1=255-parseInt(lval[i],10);
		val=val+'.'+val1;
	}
	return val;
}

function calculreversenetmaskval() {
  var btIPv4 = document.getElementById("btIPv4");
  var netmask = document.getElementById("netmask");
  var reversenetmask = document.getElementById("reversenetmask");
  /* the DOM variable above are for compatibility wit IE */
  if (btIPv4.className.indexOf('active')>=0) {
	reversenetmask.value=inversionnetmask(netmask.value);
  } else {
	reversenetmask.value=128-netmask.value;
  }
}
function calculsubnetmaskval() {
  // check & change subnet 
  subnetToNbbits();
  calculeMaskBits(); // to be sure for the right mask
  subnetToIP();
  bitsToHostsnb();
  bitsToIPsnb();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  fillinfotxtip();
  storeAllCookie();
}

function calculeSubnetval() {
  // check & change subnet 
  // change IP addresse
  subnetToIP();
  bitsToHostsnb();
  bitsToIPsnb();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  fillinfotxtip();
  storeAllCookie();
}

function calculeAddBits(nbr) {
  var bits = document.getElementById("bits");
  /* the DOM variable above are for compatibility wit IE */
  bits.value=parseInt(bits.value,10)+parseInt(nbr,10);
  calculeBits();
}

function calculeBits() {
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  /* the DOM variable above are for compatibility wit IE */
  var minbits=3, maxbits;
  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  valbits = parseInt(bits.value,10);
  if (valbits<minbits) valbits=minbits;
  if (ipversionv4) maxbits=32; else maxbits=128;
  if (valbits>maxbits) valbits=maxbits;
  bits.value=valbits;
  calculeMaskBits();
  changeSubnet();
  bitsToHostsnb();
  bitsToIPsnb();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  fillinfotxtip();
  storeAllCookie();
}

function calculeIPEnter() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var ipversion;
  ipversion = 'v4';
  if (btIPv6.className.indexOf('active')>=0)  ipversion='v6';
  if (btIPv6a.className.indexOf('active')>=0) ipversion='v6a';
  if ((ipversion.indexOf('v6')>=0) && (IPv6cchk.checked)) ipversion=ipversion+'c';
  //if (btIPv6c.className.indexOf('active')>=0) ipversion='v6c';
  error=checkIPaddress(IP.value,retval);
  IP.value=transformIPtotxt(ipversion,retval);

  calculeMaskBits();
  changeSubnet();
  bitsToHostsnb();
  bitsToIPsnb();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  fillinfotxtip();
  storeAllCookie();
}

function calculeIPButton() {
  calculeMaskBits();
  changeSubnet();
  bitsToHostsnb();
  bitsToIPsnb();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  fillinfotxtip();
  storeAllCookie();
}

function calculBitsToSelectHostsnb() {
  var bits = document.getElementById("bits");
  var selecthostsnb = document.getElementById("selecthostsnb");
  /* the DOM variable above are for compatibility wit IE */
	selecthostsnb.value=bits.value;
}
function calculHostsnbToBits() {
  var bits = document.getElementById("bits");
  var selecthostsnb = document.getElementById("selecthostsnb");
  /* the DOM variable above are for compatibility wit IE */
	bits.value= selecthostsnb.value;
	if (bits.value>24) changeIPv6();
	else calculeBits();
  fillinfotxtip();
}

function calculIPsnbToBits() {
  ipsnbToBits();
  //change bits and subnet
  bits_to_hosts();
  calculeMaskBits();
  changeSubnet();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  fillinfotxtip();
  storeAllCookie();
}

function calculRange(direction) {
  range(direction);
  //change bits and subnet
  calculeMaskBits();
  changeSubnet();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
   fillinfotxtip();
 storeAllCookie();
}

function calculeAddIP(direction) {
  addIP(direction);
  //change bits and subnet
  calculeMaskBits();
  changeSubnet();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  fillinfotxtip();
  storeAllCookie();
}

function changeClassSelecthostsnb(version) {
  var selecthostsnb = document.getElementById("selecthostsnb");
  /* the DOM variable above are for compatibility wit IE */
	if (version=='IPv6') {
		if (selecthostsnb.className.indexOf('ipv6')<0) {
		  selecthostsnb.className = selecthostsnb.className + ' ipv6';
		} 
	} else {
		selecthostsnb.className = selecthostsnb.className.replace(' ipv6','');
	}
}

function changeClassButton(button){
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var bits = document.getElementById("bits");
  /* the DOM variable above are for compatibility wit IE */
  btIPv4.className = btIPv4.className.replace('active ','');
  btIPv6.className = btIPv6.className.replace('active ','');
  btIPv6a.className = btIPv6a.className.replace('active ','');
  btIPv4.className = btIPv4.className.replace('active','');
  btIPv6.className = btIPv6.className.replace('active','');
  btIPv6a.className = btIPv6a.className.replace('active','');
  if (button.className=='') { button.className = 'active'; }
  else {button.className = 'active '+button.className;}
}

function calculwithIPv6alternative() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var subnet = document.getElementById("subnet");
  var broadcast = document.getElementById("broadcast");
  var hostfrom = document.getElementById("hostfrom");
  var hostto = document.getElementById("hostto");
  var imglanguage = document.getElementById("imglanguage");
  var IPv6cchk = document.getElementById("IPv6cchk");
  var sectionbroadcast = document.getElementById("sectionbroadcast");
  var netmask = document.getElementById("netmask");
  var netmasklabel = document.getElementById("netmasklabel");
  /* the DOM variable above are for compatibility wit IE */
  var ipversionv4;
  var retval= new Array(8);
  
  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  if (ipversionv4) changeIPv4IPv6();
  changeClassButton(btIPv6a);
  changeClassSelecthostsnb('IPv6');
  lang=imglanguage.className.replace('imglanguage').trim();
  readselectbits(lang);
  createselectSubnet();
  error=checkIPaddress(IP.value,retval);
  IP.value=transformIPtotxt('v6a',retval);
  changeSubnet();
  bitsToHostsnb();
  bitsToIPsnb();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();

  if (IPv6cchk.checked) {
    IP.value=condense(IP.value);
    subnet.value=condense(subnet.value);
    broadcast.value=condense(broadcast.value);
    hostfrom.value=condense(hostfrom.value);
    hostto.value=condense(hostto.value);
  }
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  fillinfotxtip();
  if (btIPv4.className.indexOf('active')>=0) {
	  sectionbroadcast.style.display='inline';
	  netmask.style.visibility ='visible';
	  netmasklabel.style.visibility ='visible';	  
  } else {
	  sectionbroadcast.style.display='none';
	  netmask.style.visibility ='hidden';
	  netmasklabel.style.visibility ='hidden';	  
  }
  storeAllCookie();
}

function changeIPv4() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  var subnet = document.getElementById("subnet");
  var hostfrom = document.getElementById("hostfrom");
  var hostto = document.getElementById("hostto");
  var netmask = document.getElementById("netmask");
  var netmasklabel = document.getElementById("netmasklabel");
  var hostsnb = document.getElementById("hostsnb");
  var ipsnb = document.getElementById("ipsnb");
  var imglanguage = document.getElementById("imglanguage");
  var selecthostsnb = document.getElementById("selecthostsnb");
  var sectionbroadcast = document.getElementById("sectionbroadcast");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var ipval,ipvaltxt;
  var tipv4= new Array(4);
  var tempval;
  
  ipval=IP.value;
  error=checkIPaddress(ipval,retval);
  tipv4[0]= retval[6]>>8;
  tipv4[1]= retval[6] & 255;
  tipv4[2]= retval[7]>>8;
  tipv4[3]= retval[7] & 255;
  IP.value= tipv4[0].toString(10)+'.'+tipv4[1].toString(10)+'.'+tipv4[2].toString(10)+'.'+tipv4[3].toString(10);

  changeClassButton(btIPv4);
  changeClassSelecthostsnb('IPv4');
  lang=imglanguage.className.replace('imglanguage').trim();
  readselectbits(lang);
  createselectSubnet();
  var tempval=parseInt(bits.value,10);
  bitszone=96;
  if (tempval>bitszone) {
 	   bits.value= tempval-bitszone;
 	   netmask.value= tempval-bitszone;
  	   hostsnb.value= tempval-bitszone;
 	   ipsnb.value= tempval-bitszone;
	   }
  else if (tempval>64) {
 	   bits.value= tempval-64;
 	   netmask.value= tempval-64;
  	   hostsnb.value= tempval-64;
 	   ipsnb.value= tempval-64;
  } else if (tempval>48) {
 	   bits.value= tempval-48;
 	   netmask.value= tempval-48;
  	   hostsnb.value= tempval-48;
 	   ipsnb.value= tempval-48;
  } else if (tempval>32) {
 	   bits.value= tempval-32;
 	   netmask.value= tempval-32;
  	   hostsnb.value= tempval-32;
 	   ipsnb.value= tempval-32;
  } else {
 	   bits.value= tempval;
 	   netmask.value= tempval;
 	   hostsnb.value= tempval;
 	   ipsnb.value= tempval;
 	}
  changeSubnet();
  bitsToHostsnb();
  bitsToIPsnb();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  if (btIPv4.className.indexOf('active')>=0) {
	  sectionbroadcast.style.display='inline';
	  netmask.style.visibility ='visible';
	  netmasklabel.style.visibility ='visible';	  
  } else {
	  sectionbroadcast.style.display='none';
	  netmask.style.visibility ='hidden';
	  netmasklabel.style.visibility ='hidden';	  
  }
  fillinfotxtip();
  storeAllCookie();
}

function setIPv6cCheckbox() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var broadcast = document.getElementById("broadcast");
  var subnet = document.getElementById("subnet");
  var hostfrom = document.getElementById("hostfrom");
  var hostto = document.getElementById("hostto");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  var ipversionv4;
  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  if (!ipversionv4) {
    if (IPv6cchk.checked) {
      IP.value=condense(IP.value);
      broadcast.value=condense(broadcast.value);
      subnet.value=condense(subnet.value);
      hostfrom.value=condense(hostfrom.value);
      hostto.value=condense(hostto.value);
	} else {
      IP.value=expended(IP.value);
      broadcast.value=expended(broadcast.value);
      subnet.value=expended(subnet.value);
      hostfrom.value=expended(hostfrom.value);
      hostto.value=expended(hostto.value);
	}
    fillinfotxtip();
    storeAllCookie();
  }
}

function changeIPv6() {
  var IP = document.getElementById("IP");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  var netmask = document.getElementById("netmask");
  var netmasklabel = document.getElementById("netmasklabel");
  var hostsnb = document.getElementById("hostsnb");
  var ipsnb = document.getElementById("ipsnb");
  var imglanguage = document.getElementById("imglanguage");
  var IPv6cchk = document.getElementById("IPv6cchk");
  var sectionbroadcast = document.getElementById("sectionbroadcast");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var ipval,ipvaltxt;
  var tipv4= new Array(4);
  var tempval,error;
  
  ipval=IP.value;
  error=checkIPaddress(ipval,retval);
  // certaines adresse IP recoivent un autre prefix
  if ((0xE000<=retval[6]) && (retval[6]<0xF000))	    retval[0]=0xFF00; // multicast 224.x.x.x 239.x.x.x
  else if ((0x7F00<=retval[6]) && (retval[6]<0x8000)) retval[0]=0;      // 127.x.x.x
  else if ((0x0A00<=retval[6]) && (retval[6]<0x0B00)) retval[0]=0xFE80; // private class A
  else if ((0xAC10<=retval[6]) && (retval[6]<0xAC20)) retval[0]=0xFE80; // private class B
  else if (0xC0A8==retval[6])			    retval[0]=0xFE80; // private class C
  else retval[0]=0x2002;
  // change les autres champs
  if (IPv6cchk.checked) {
    ipvaltxt= transformIPtotxt('v6c',retval);
  } else {
    ipvaltxt= transformIPtotxt('v6',retval);
  }
  IP.value= ipvaltxt;
  changeClassButton(btIPv6);
  changeClassSelecthostsnb('IPv6');
  lang=imglanguage.className.replace('imglanguage').trim();
  readselectbits(lang);
  createselectSubnet();
  tempval=parseInt(bits.value,10);
  if (0>=tempval) tempval=1;
  bits.value= tempval;
  netmask.value= tempval;
  hostsnb.value= tempval;
  ipsnb.value= tempval;
  changeSubnet();
  bitsToHostsnb();
  bitsToIPsnb();
  getBroadcast();
  getHostfrom();
  getHostTo();
  changeInfo();
  calculBitsToSelectHostsnb();
  calculreversenetmaskval();
  if (btIPv4.className.indexOf('active')>=0) {
	  sectionbroadcast.style.display='inline';
	  netmask.style.visibility ='visible';
	  netmasklabel.style.visibility ='visible';	  
  } else {
	  sectionbroadcast.style.display='none';
	  netmask.style.visibility ='hidden';
	  netmasklabel.style.visibility ='hidden';	  
  }
  fillinfotxtip();
  storeAllCookie();
}

function changeIPv4IPv6() {
  var btIPv4 = document.getElementById("btIPv4");
  /* the DOM variable above are for compatibility wit IE */
  var retval= new Array(8);
  var ipval,ipvaltxt;
  var tipv4= new Array(4);
  var tempval;
  var infoip= new Array(2);

  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  if (ipversionv4) {
  	// change to IPv6
	changeIPv6();
  }
  else {
  	// change to IPv4
	changeIPv4();
  }
  fillinfotxtip();
}

function change_class(theclass)
{
  var btIPv4 = document.getElementById("btIPv4");
  var btIPv6 = document.getElementById("btIPv6");
  var btIPv6a = document.getElementById("btIPv6a");
  var IPv6cchk = document.getElementById("IPv6cchk");
  /* the DOM variable above are for compatibility wit IE */
  switch(theclass) {
    case 'ipv4example_1': // 'ipv4classa':
	  initializeValues('IPv4',-1,'1.0.0.1',8,'255.0.0.0','1.0.0.0','1.255.255.255','1.0.0.1','1.255.255.254',16777214,16777216);
      break;
    case 'ipv4example_2': //'ipv4classb':
	  initializeValues('IPv4',-1,'128.0.0.1',16,'255.255.0.0','128.0.0.0','128.0.255.255','128.0.0.1','128.0.255.254',65534,65536);
      break;
    case 'ipv4example_3': //'ipv4classc':
	  initializeValues('IPv4',-1,'192.0.0.1',24,'255.255.255.0','192.0.0.0','192.0.0.255','192.0.0.1','192.0.0.254',254,256);
      break;
    case 'ipv4example_4': //'ipv4classd':
	  initializeValues('IPv4',-1,'224.0.0.1',8,'255.0.0.0','224.0.0.0','224.255.255.255','224.0.0.1','224.255.255.254',16777214,16777216);
      break;
    case 'ipv6example_1': //'ipv6reserved':
	  initializeValues('IPv6',1,':4A2B::1F3F',120,'',':4A2B::1F00','FF00:4A2B::1FFF',':4A2B::1f01',':4A2B::1FFE',254,256)
      break;
    case 'ipv6example_2': //'ipv6loopback':
	  initializeValues('IPv6',1,'::1',128,'255.0.0.0','::1','FF00::1','::1','::1',1,1)
      break;
    case 'ipv6example_3': //'ipv6_2000':
	  initializeValues('IPv6',1,'2000:4A2B::1F3F',120,'','2000:4A2B::1F00','FF00:4A2B::1FFF','2000:4A2B::1f01','2000:4A2B::1FFE',254,256)
      break;
    case 'ipv6example_4': //'ipv6_2001':
	  initializeValues('IPv6',1,'2001:4A2B::1F3F',48,'','2001:4A2B::1F00','FF00:4A2B::1FFF','2001:4A2B::1f01','2001:4A2B::1FFE',254,256)
      break;
    case 'ipv6example_5': //'ipv6_2002':
	  initializeValues('IPv6',1,'2002::123.45.67.89',48,'','2002::123.45.67.64','FF00:4A2B::1FFF','2002:4A2B::1f01','2002:4A2B::1FFE',62,64)
      break;
    case 'ipv6example_6': //'ipv6multi subnet':
	  initializeValues('IPv6',1,'FF00::',8,'','FF00::','FF00::','FF00::1','FF00:FFFF:FFFF:FFFF',1.32922799578492E+036,1.32922799578492E+036)
      break;
    case 'ipv6example_7': //'ipv6multi':
	  initializeValues('IPv6',1,'FF00:4A2B::1F3F',48,'','FF00:4A2B::1F00','FF00:4A2B::1FFF','FF00:4A2B::1f01','FF00:4A2B::1FFE',254,256)
      break;
    case 'ipv6example_8': //'ipv6linklocal':
	  initializeValues('IPv6',1,'FE85:4A2B::1F3F',120,'','FE85:4A2B::1F00','FF00:4A2B::1FFF','FE85:4A2B::1f01','FE85:4A2B::1FFE',254,256)
      break;
    case 'ipv6example_9': //'ULA Unique Local Address':
	  initializeValues('IPv6',1,'FC00:A1A1:B2B2::23',48,'','FC00:A1A1:B2B2::','FF01::1','FC00:A1A1:B2B2::1','FC00:A1A1:B2B2:FFFF:FFFF',254,256)
      break;
    case 'ipv6example_10': //'ipv6localipv4':
	  initializeValues('IPv6',1,'FE80::172.30.67.89',120,'','FE80::172.30.67.64','FE80::AC10:43ff','FE80::AC10:4301','FE80::AC10:43fe',254,256)
      break;
    case 'ipv6example_11': //'ipv6_6bone':
	  initializeValues('IPv6',1,'3FFE:4A2B::1F3F',120,'','3FFE:4A2B::1F00','FF00:4A2B::1FFF','3FFE:4A2B::1F01','3FFE:4A2B::1FFE',254,256)
      break;
    case 'ipv6example_12': //'Broadcast subnet':
	  initializeValues('IPv6',1,'FF01::1',128,'255.0.0.0','FF01::1','FF01::1','FF01::1','FF01::1',1,1)
      break;
    case 'ipv6example_13': //'broadcast router':
	  initializeValues('IPv6',1,'FF02::2',128,'255.0.0.0','FF02::2','FF02::2','FF02::2','FF02::2',1,1)
      break;
    default:
      alert("error example "+theclass);
      break;
  }
  changeInfo();
}

function infoIPv4v6(){
  var infoIPv4v6txt = document.getElementById("infoIPv4v6txt");
  var infoIPv4v6btn = document.getElementById("infoIPv4v6btn");
  var iframeinfo = document.getElementById("iframeinfo");
  var selecthostsnb = document.getElementById("selecthostsnb");
  var imglanguage = document.getElementById("imglanguage");
  /* the DOM variable above are for compatibility wit IE */
	txt=infoIPv4v6txt.className;
	btn=infoIPv4v6btn.className;
	iframeinfo.style.display='none';
	if (txt.indexOf('hidetxt')<0){
	  txt= txt.replace('showtxt','').trim();
	  txt= txt.replace(/\s+/gi," ");
	  btn= btn.replace('showtxt','').trim();
	  btn= btn.replace(/\s+/gi," ");
	  infoIPv4v6txt.className=txt +' hidetxt';
	  infoIPv4v6btn.className=btn +' hidetxt';
	} else {
	  txt= txt.replace('hidetxt','').trim();
	  txt= txt.replace(/\s+/gi," ");
	  btn= btn.replace('hidetxt','').trim();
	  btn= btn.replace(/\s+/gi," ");
	  infoIPv4v6txt.className=txt +' showtxt';
	  infoIPv4v6btn.className=btn +' showtxt';
	  iframeinfo.style.display='inline';
	  //infoIPv4v6txt.innerHTML = explanation;
	  lang= imglanguage.className.replace('imglanguage','').trim();
	  if ((lang=='WORLD') || (lang=='US')|| (lang=='UK')) lang='EN';
	  iframeinfo.src ="./lang/infoIPv4v6-"+lang+".html"; // #p1";
      //iframeinfo.contentDocument.location.reload(true);
	  iframeinfo.style.display='inline';
//      $("#infoIPv4v6txt").load("./lang/infoIPv4v6-"+lang+".html #p1", function(responseTxt, statusTxt, xhr){
//		if (statusTxt != "success") {
//			iframeinfo.style.display='inline';
//			iframeinfo.style.visibility='visible';
//		}
        //if(statusTxt == "success")
        //    alert("External content loaded successfully!");
        //if(statusTxt == "error")
        //    alert("Error: " + xhr.status + ": " + xhr.statusText);
//      });
	}
}

function changeInfo() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var infotxtip = document.getElementById("infotxtip");
  /* the DOM variable above are for compatibility wit IE */
  var txt='',valip,ipversionv4;
  var retval= new Array(8);
  var partip4 = new Array(4);  
  
  ipversionv4=(btIPv4.className.indexOf('active')>=0);
  valip=IP.value;
  noerror=extractIPformat(valip,retval,partip4);
  if (noerror>=0) {
//alert('changeInfo IPV6 format:'+retval[0].toString(16)+':'+retval[1].toString(16)+':'+retval[2].toString(16)+':'+retval[3].toString(16)+':'
//+retval[4].toString(16)+':'+retval[5].toString(16)+':'+retval[6].toString(16)+':'+retval[7].toString(16));
   infotxtip.className= infotxtip.className.replace(/ infoIP4_[0-9]{1,2}/,'');
   infotxtip.className= infotxtip.className.replace(/ infoIP6_[0-9]{1,2}/,'');
   if (ipversionv4) {
    if ((0x7F00<=retval[6]) && (retval[6]<0x8000)) {
		infotxtip.className=infotxtip.className+' infoIP4_09';
		// localhost 127.x.x.x
	}
    else if ((0x0A00<=retval[6]) && (retval[6]<0x0B00)) {
		infotxtip.className=infotxtip.className+' infoIP4_01';
		// private class A
	}
    else if ((0x0100<=retval[6]) && (retval[6]<0x7F00)) {
		infotxtip.className=infotxtip.className+' infoIP4_04'; 
		// class A 1.x.x.x 127.x.x.x
	}
    else if ((0x8000<=retval[6]) && (retval[6]<0xC000)) {
		infotxtip.className=infotxtip.className+' infoIP4_05'; 
		// class A 128.x.x.x 191.x.x.x
	}
    else if ((0xAC10<=retval[6]) && (retval[6]<0xAC20))	{
		infotxtip.className=infotxtip.className+' infoIP4_02';
		// private class B
	}
    else if (0xC0A8==retval[6]) {
		infotxtip.className=infotxtip.className+' infoIP4_03'; 
		// private class C
	}
    else if ((0xC000<=retval[6]) && (retval[6]<0xE000)) {
		infotxtip.className=infotxtip.className+' infoIP4_06'; 
		// class A 192.x.x.x 223.x.x.x
	}
    else if ((0xE000<=retval[6]) && (retval[6]<0xF000)) {
		infotxtip.className=infotxtip.className+' infoIP4_07'; 
		//multicast 224.x.x.x 239.x.x.x
	}
    else if ((0xF000<=retval[6]) &&(retval[6]<=0xFF00)) {
		infotxtip.className=infotxtip.className+' infoIP4_08'; 
		// other     240.x.x.x 255.x.x.x
	}
    else {
		infotxtip.className=infotxtip.className+' infoIP4_00'; 
	}
   } else { //IPv6 messages
    tip= condense(valip);
    if ((tip=='FF01::1') || (tip=='FF02::1')) {
		infotxtip.className=infotxtip.className+' infoIP6_10'; 
	}
    else if ((tip=='FF01::2') || (tip=='FF02::2')|| (tip=='FF05::2')) {
		infotxtip.className=infotxtip.className+' infoIP6_11'; 
	}
    else if (retval[0]==0x0000) {
		infotxtip.className=infotxtip.className+' infoIP6_00'; 
	}
    else if (retval[0]==0x0000) {
		infotxtip.className=infotxtip.className+' infoIP6_00'; 
	}
    else if (retval[0]==0x0001) {
		infotxtip.className=infotxtip.className+' infoIP6_01'; 
	}
    else if ((0x0002<=retval[0]) & (retval[0]<=0x0003)) {
		infotxtip.className=infotxtip.className+' infoIP6_02'; 
	}
    else if (retval[0] == 0x0004) {
		infotxtip.className=infotxtip.className+' infoIP6_03'; 
	}
    else if ((0x2000<=retval[0]) & (retval[0]<=0x2002)) {
		infotxtip.className=infotxtip.className+' infoIP6_04'; 
	}
    else if ((retval[0] & 0xFF00)==0xFF00) {
		infotxtip.className=infotxtip.className+' infoIP6_05'; 
	}
    else if ((0xFC00 <= retval[0]) && (retval[0]<=0xFDFF)) {
		infotxtip.className=infotxtip.className+' infoIP6_06'; 
	}
    else if ((retval[0] & 0xFE80)==0xFE80) {
		infotxtip.className=infotxtip.className+' infoIP6_07'; 
	}
    else if (retval[0]==0x3FFE) {
		infotxtip.className=infotxtip.className+' infoIP6_08'; 
	}
    else {
		infotxtip.className=infotxtip.className+' infoIP6_09'; 
	}
   }
  } else alert('Error in the IP:'+valip);
}

function openhelp2() {
  var theLocation='help.txt';
  var fileContent='',f;
  f = new File(theLocation);
  if (f.open("r") == true)
  {
    while(!f.eof())
    {
     fileContent += f.read(1);
    }
    f.close();
  }
  alert(fileContent);
}

function openhelp() {
  var datafile='help.txt';
  var fileContent='',f;
  
  typenavigator=browsertype();
  if (typenavigator!=='IE') {
     objXml = new XMLHttpRequest();
     objXml.open("GET",datafile,false);
     objXml.send(null);
     alert(objXml.responseText);
  } else {
    objXml = new ActiveXObject("Microsoft.XMLHTTP");
    objXml.open("GET", datafile, true);
    objXml.onreadystatechange=function() {
      if (objXml.readyState==4) {
       alert(objXml.responseText);
     }
    }
    objXml.send(null);
  }
}

function openhelp3() {
  var datafile=getScriptPath(); //'help.txt';
  var fileContent='',f;
  fh = fopen(datafile, 0); // Open the file for reading
  if(fh!=-1) // If the file has been successfully opened
  {
    length = flength(fh);         // Get the length of the file    
    str = fread(fh, length);     // Read in the entire file
    fclose(fh);                    // Close the file

    // Display the contents of the file    
    alert(str);    
  }
}

function changeDivLanguageText(object,lang){
	a=object.className;
	a= a.replace('WORLD','');
	a= a.replace('UK','');
	a= a.replace('FR','');
	a= a.replace('US','');
	a= a.replace('DE','');
	a= a.replace('IT','');
	a= a.trim();
	if (a=='') { object.className = lang.toUpperCase(); }
	else {object.className = a+' '+lang.toUpperCase();}
}

function setlanguageObjects(lang) {
  var maintitle = document.getElementById("maintitle");
  var imglanguage = document.getElementById("imglanguage");
  var panelformat = document.getElementById("panelformat");
  var panelcalculationtxt = document.getElementById("panelcalculationtxt");
  var infoIPv4v6btn = document.getElementById("infoIPv4v6btn");
  var iframeinfo = document.getElementById("iframeinfo");
  var hostfromlabel = document.getElementById("hostfromlabel");
  var hosttolabel = document.getElementById("hosttolabel");
  var IPv4menutxt = document.getElementById("IPv4menutxt");
  var IPv6menutxt = document.getElementById("IPv6menutxt");
  var IPv6cmenutxt = document.getElementById("IPv6cmenutxt");
  var IPv6amenutxt = document.getElementById("IPv6amenutxt");
  var panelinfo = document.getElementById("panelinfo");
  var panelexample = document.getElementById("panelexample");
  var reversenetmasklabel = document.getElementById("reversenetmasklabel");
  var infotxtip = document.getElementById("infotxtip");
  var textipbtn = document.getElementById("textipbtn");
  /* the DOM variable above are for compatibility wit IE */
  var theexamples;
	imglanguage.className='imglanguage '+lang;
	imglanguage.src='./images/'+lang+'-flg.png';
	changeDivLanguageText(maintitle,lang);
	changeDivLanguageText(panelformat,lang);
	changeDivLanguageText(hostfromlabel,lang);
	changeDivLanguageText(broadcastlabel,lang);
	changeDivLanguageText(hosttolabel,lang);
	changeDivLanguageText(IPv4menutxt,lang);
	changeDivLanguageText(IPv6menutxt,lang);
	changeDivLanguageText(IPv6cmenutxt,lang);
	changeDivLanguageText(IPv6amenutxt,lang);
	changeDivLanguageText(panelcalculationtxt,lang);
	changeDivLanguageText(panelinfo,lang);
	changeDivLanguageText(panelexample,lang);
	changeDivLanguageText(infoIPv4v6btn,lang);
	changeDivLanguageText(iframeinfo,lang);
	changeDivLanguageText(reversenetmasklabel,lang);
	changeDivLanguageText(infotxtip,lang);
	changeDivLanguageText(textipbtn,lang);
    theexamples = $('*[id^="ipv4example_"]');
	for (i=0;i<theexamples.length;i++) {
	   changeDivLanguageText(theexamples[i],lang);
	}
    theexamples = $('*[id^="ipv6example_"]');
    //theexamples = document.getElementsByTagName('ipv6example_*');
	for (i=0;i<theexamples.length;i++) {
	   changeDivLanguageText(theexamples[i],lang);
	}
	if ((lang=='WORLD') || (lang=='US')|| (lang=='UK')) lang='EN';
    iframeinfo.src ="./lang/infoIPv4v6-"+lang+".html"; // #p1";
    //iframeinfo.contentDocument.location.reload(true);
	if (infoIPv4v6btn.className.indexOf('hidetxt')<0){
	  iframeinfo.style.display='inline';
	} else {
	  iframeinfo.style.display='none';		
	}
	readselectbits(lang);
}

function changelanguage(lang) {
	setlanguageObjects(lang);
    storeAllCookie();
}

function readhtmlselectbits(){
  var imglanguage = document.getElementById("imglanguage");
  var lang = imglanguage.className.replace('imglanguage','');
  lang = lang.trim();
  readselectbits(lang);
}

function readselectbits(lang) {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  var selecthostsnb = document.getElementById("selecthostsnb");
  /* the DOM variable above are for compatibility wit IE */
  var selectstr="",selectval="",options ='';
  lang = lang.replace('imglanguage','');
  lang = lang.trim();
  ipversion=(btIPv4.className.indexOf('active')>=0) ? 'IPv4':'IPv6';
  selectstr= getBitsHumanformat(ipversion,lang);
  if (selectstr=='') {
	  selectstr= '32;IPv4 (32bits) => 1 IP'+";;"
	     +'31;IPv4 (31bits) => 2 IPs'+";;"
		 +'30;IPv4 (30bits) => 4 IPs'+";;"
		 +'29;IPv4 (29bits) => 8 IPs'+";;"
		 +'28;IPv4 (28bits) => 16 IPs'+";;"
		 +'27;IPv4 (27bits) => 32 IPs'+";;"
		 +'26;IPv4 (26bits) => 64 IPs'+";;"
		 +'25;IPv4 (25bits) => 128 IPs'+";;";
		 +'24;IPv4 (24bits) => 254 IPs';
  }
  selectstrlist= selectstr.split(';;');
  var x = selecthostsnb.childNodes;
  for (var i = x.length-1; i >=0 ; i--) {
    selecthostsnb.removeChild(x[i]);
  }
  for (i=0;i<selectstrlist.length;i++) {
	var val = selectstrlist[i].split(';');
    var option=document.createElement("option");
	option.text=val[1];
	option.value=val[0];
	option.id='optionselectstr'+val[0];
	selecthostsnb.add(option);
    selecthostsnb.value=bits.value;	
  }
}

function fillinfotxtip() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  var selecthostsnb = document.getElementById("selecthostsnb");
  var textip = document.getElementById("textip");
  var netmask = document.getElementById("netmask");
  var subnet = document.getElementById("subnet");
  var reversenetmask = document.getElementById("reversenetmask");
  /* the DOM variable above are for compatibility wit IE */
  ipversion=(btIPv4.className.indexOf('active')>=0) ? 'IPv4':'IPv6';
  valx = "";
  if (ipversion=='IPv4') {
   valx = valx + "IP="+IP.value+" / " +netmask.value+"\n";	  
   valx = valx + "CIDR="+IP.value+" / " +bits.value+"\n";	  
   valx = valx + "subnet="+subnet.value+" / " +netmask.value+"\n";	  
   valx = valx + "wilcard="+reversenetmask.value;	  
  } else {
   valx = valx + "CIDR="+IP.value+" / " +bits.value+"\n";	  
   valx = valx + "subnet="+subnet.value+" / " +bits.value;	  
  }
  $('#textip').val(valx);

}

function getBitsHumanformat(version,lang) {
	var str='',astr,fi;
	var number;
	var large_numbers;
	astr=[
      '1'
     ,'2'
     ,'4'
     ,'8'
     ,'16'
     ,'32'
     ,'64'
     ,'128'
     ,'256'
     ,'512'
     ,'1024'
     ,'2048'
     ,'4096'
     ,'8192'
     ,'16384'
     ,'32768'
     ,'65536'
     ,'131072'
     ,'262144'
     ,'524288'
     ,'1048576'
     ,'2097152'
     ,'4194304'
     ,'8388608'
     ,'16777216'
     ,'33554432'
     ,'67108864'
     ,'134217728'
     ,'268435456'
     ,'536870912'
     ,'1073741824'
     ,'2147483648'
     ,'4294967296'
     ,'8589934592'
     ,'17179869184'
     ,'34359738368'
     ,'68719476736'
     ,'137438953472'
     ,'274877906944'
     ,'549755813888'
     ,'1099511627776'
     ,'2199023255552'
     ,'4398046511104'
     ,'8796093022208'
     ,'17592186044416'
     ,'35184372088832'
     ,'70368744177664'
     ,'140737488355328'
     ,'281474976710656'
     ,'562949953421312'
     ,'1.12589990684262E+015'
     ,'2.25179981368525E+015'
     ,'4.5035996273705E+015'
     ,'9.00719925474099E+015'
     ,'1.8014398509482E+016'
     ,'3.6028797018964E+016'
     ,'7.20575940379279E+016'
     ,'1.44115188075856E+017'
     ,'2.88230376151712E+017'
     ,'5.76460752303424E+017'
     ,'1.15292150460685E+018'
     ,'2.30584300921369E+018'
     ,'4.61168601842739E+018'
     ,'9.22337203685478E+018'
     ,'1.84467440737096E+019'
     ,'3.68934881474191E+019'
     ,'7.37869762948382E+019'
     ,'1.47573952589676E+020'
     ,'2.95147905179353E+020'
     ,'5.90295810358706E+020'
     ,'1.18059162071741E+021'
     ,'2.36118324143482E+021'
     ,'4.72236648286965E+021'
     ,'9.44473296573929E+021'
     ,'1.88894659314786E+022'
     ,'3.77789318629572E+022'
     ,'7.55578637259143E+022'
     ,'1.51115727451829E+023'
     ,'3.02231454903657E+023'
     ,'6.04462909807315E+023'
     ,'1.20892581961463E+024'
     ,'2.41785163922926E+024'
     ,'4.83570327845852E+024'
     ,'9.67140655691703E+024'
     ,'1.93428131138341E+025'
     ,'3.86856262276681E+025'
     ,'7.73712524553363E+025'
     ,'1.54742504910673E+026'
     ,'3.09485009821345E+026'
     ,'6.1897001964269E+026'
     ,'1.23794003928538E+027'
     ,'2.47588007857076E+027'
     ,'4.95176015714152E+027'
     ,'9.90352031428304E+027'
     ,'1.98070406285661E+028'
     ,'3.96140812571322E+028'
     ,'7.92281625142643E+028'
     ,'1.58456325028529E+029'
     ,'3.16912650057057E+029'
     ,'6.33825300114115E+029'
     ,'1.26765060022823E+030'
     ,'2.53530120045646E+030'
     ,'5.07060240091292E+030'
     ,'1.01412048018258E+031'
     ,'2.02824096036517E+031'
     ,'4.05648192073033E+031'
     ,'8.11296384146067E+031'
     ,'1.62259276829213E+032'
     ,'3.24518553658427E+032'
     ,'6.49037107316853E+032'
     ,'1.29807421463371E+033'
     ,'2.59614842926741E+033'
     ,'5.19229685853483E+033'
     ,'1.03845937170697E+034'
     ,'2.07691874341393E+034'
     ,'4.15383748682786E+034'
     ,'8.30767497365573E+034'
     ,'1.66153499473114E+035'
     ,'3.32306998946229E+035'
     ,'6.64613997892458E+035'
     ,'1.32922799578492E+036'
     ,'2.65845599156983E+036'
     ,'5.31691198313966E+036'
     ,'1.06338239662793E+037'
     ,'2.12676479325587E+037'
     ,'4.25352958651173E+037'
     ,'8.50705917302346E+037'
     ,'1.70141183460469E+038'
     ,'3.40282366920938E+038'
	 ];
  large_numbers = [
[0,'US','UK','EU'],
[1,'','',''],
[2,'','',''],
[3,'','',''],
[4,'','',''],
[5,'','',''],
[6,'Million','Million','Million'],
[6,'Million','Million','Million'],
[6,'Million','Million','Million'],
[9,'Billion','Thousand million','Milliard'],
[9,'Billion','Thousand million','Milliard'],
[9,'Billion','Thousand million','Milliard'],
[12,'Trillion','Billion','Billion'],
[12,'Trillion','Billion','Billion'],
[12,'Trillion','Billion','Billion'],
[15,'Quadrillion','Thousand billion','Billiard'],
[15,'Quadrillion','Thousand billion','Billiard'],
[15,'Quadrillion','Thousand billion','Billiard'],
[18,'Quintillion','Trillion','Trillion'],
[18,'Quintillion','Trillion','Trillion'],
[18,'Quintillion','Trillion','Trillion'],
[21,'Sextillion','Thousand trillion','Trilliard'],
[21,'Sextillion','Thousand trillion','Trilliard'],
[21,'Sextillion','Thousand trillion','Trilliard'],
[24,'Septillion','Quadrillion','Quadrillion'],
[24,'Septillion','Quadrillion','Quadrillion'],
[24,'Septillion','Quadrillion','Quadrillion'],
[27,'Octillion','Thousand quadrillion','Quadrilliard'],
[27,'Octillion','Thousand quadrillion','Quadrilliard'],
[27,'Octillion','Thousand quadrillion','Quadrilliard'],
[30,'Nonillion','Quintillion','Quintillion'],
[30,'Nonillion','Quintillion','Quintillion'],
[30,'Nonillion','Quintillion','Quintillion'],
[33,'Decillion','Thousand quintillion','Quintilliard'],
[33,'Decillion','Thousand quintillion','Quintilliard'],
[33,'Decillion','Thousand quintillion','Quintilliard'],
[36,'Undecillion','Sextillion','Sextillion'],
[36,'Undecillion','Sextillion','Sextillion'],
[36,'Undecillion','Sextillion','Sextillion']
  ];
  /* the DOM variable above are for compatibility wit IE */
   switch (lang.toUpperCase()) {
	  case 'FR': fi = 3; break;
	  case 'DE': fi = 3; break;
	  case 'IT': fi = 3; break;
	  case 'UK': fi = 2; break;
	  case 'DE': fi = 3; break;
	default:
      fi = 1;
  }
  if (version=='IPv4') { max= 32; } else { max=128;}
  for (var i=0,j=max;i<astr.length;i++) {
  	var val= astr[i],val2,chiffre;
  	var poweridx,power,nbr;
  	if (val.indexOf('E+')>=0) {
  	  poweridx = val.indexOf('E+');
  	  power= val.substring(poweridx+3);
  	  val2 = val.replace('.','');
  	  nbr=val2.substring(0,power-large_numbers[power][0]+1);
  	  number = large_numbers[power][fi];
  	  chiffre=nbr+' '+number;
  	  val = chiffre + " = "+val;
  	}
	prefix='not standard ';
	if ((j==127) || (j<=48)) {
       if (version=='IPv4') prefix="IPv4 ";
	   else prefix='IPv6 ';
	}
  	if (str=='') str = j+ ';' + prefix + '(' + j + 'bits) => '+ val+" IP(s)";
      else str = str+ ';;' + j+ ';' + prefix + '(' + j + 'bits) => '+ val+" IP(s)";
	j--;
	if (j<=0) break;
  }
  return str;
}

function calculNbSubnet() {
  var bits = document.getElementById("bits");
  var selectnbsubnet = document.getElementById("selectnbsubnet");
  /* the DOM variable above are for compatibility wit IE */
	bits.value= selectnbsubnet.value;
	if (bits.value>24) changeIPv6();
	else calculeBits();
}

function createselectSubnet() {
  var IP = document.getElementById("IP");
  var btIPv4 = document.getElementById("btIPv4");
  var bits = document.getElementById("bits");
  var selecthostsnb = document.getElementById("selecthostsnb");
  var selectnbsubnet = document.getElementById("selectnbsubnet");
  /* the DOM variable above are for compatibility wit IE */
  var ipversion,selectstr="";
  ipversion=(btIPv4.className.indexOf('active')>=0) ? 'IPv4':'IPv6';
  if (ipversion=='IPv4') {
	  selectstr= '1;1 bits ->8388608 of /24;;'
        +'2;2 bits ->4194304 of /24;;'
        +'3;3 bits ->2097152 of /24;;'
        +'4;4 bits ->1048576 of /24;;'
        +'5;5 bits ->524288 of /24;;'
        +'6;6 bits ->262144 of /24;;'
        +'7;7 bits ->131072 of /24;;'
        +'8;8 bits ->65536 of /24;;'
        +'9;9 bits ->32768 of /24;;'
        +'10;10 bits ->16384 of /24;;'
        +'11;11 bits ->8192 of /24;;'
        +'12;12 bits ->4096 of /24;;'
        +'13;13 bits ->2048 of /24;;'
        +'14;14 bits ->1024 of /24;;'
        +'15;15 bits ->512 of /24;;'
        +'16;16 bits ->256 of /24;;'
        +'17;17 bits ->128 of /24;;'
        +'18;18 bits ->64 of /24;;'
        +'19;19 bits ->32 of /24;;'
        +'20;20 bits ->16 of /24;;'
        +'21;21 bits ->8 of /24;;'
        +'22;22 bits ->4 of /24;;'
        +'23;23 bits ->2 of /24;;'
        +'24;24 bits ->1 of /24;;'
        +'25;25 bits ->8 of /28;;'
        +'26;26 bits ->4 of /28;;'
        +'27;27 bits ->2 of /28;;'
        +'28;28 bits ->8 of /28;;'
        +'29;29 bits ->4 of 2 IPs;;'
        +'30;30 bits ->2 of 2 IPs;;'
        +'31;31 bits ->1 of 2 IPs;;'
        +'32;32 bits ->1 of 1 IPs;;';
  } else {
	  selectstr= '1;1 bits -> 9223372036854 millions of /64;;'
+'2;2 bits -> 4611686018427 millions of /64;;'
+'3;3 bits -> 2305843009213 millions of /64;;'
+'4;4 bits -> 1152921504606 millions of /64;;'
+'5;5 bits -> 576460752303 millions of /64;;'
+'6;6 bits -> 288230376151 millions of /64;;'
+'7;7 bits -> 144115188075 millions of /64;;'
+'8;8 bits -> 72057594037 millions of /64;;'
+'9;9 bits -> 36028797018 millions of /64;;'
+'10;10 bits -> 18014398509 millions of /64;;'
+'11;11 bits -> 9007199254 millions of /64;;'
+'12;12 bits -> 4503599627 millions of /64;;'
+'13;13 bits -> 2251799813 millions of /64;;'
+'14;14 bits -> 1125899906 millions of /64;;'
+'15;15 bits -> 562949953 millions of /64;;'
+'16;16 bits -> 281474976 millions of /64;;'
+'17;17 bits -> 140737488 millions of /64;;'
+'18;18 bits -> 70368744 millions of /64;;'
+'19;19 bits -> 35184372 millions of /64;;'
+'20;20 bits -> 17592186 millions of /64;;'
+'21;21 bits -> 8796093 millions of /64;;'
+'22;22 bits -> 4398046 millions of /64;;'
+'23;23 bits -> 2199023 millions of /64;;'
+'24;24 bits -> 1099511 millions of /64;;'
+'25;25 bits -> 549755 millions of /64;;'
+'26;26 bits -> 274877 millions of /64;;'
+'27;27 bits -> 137438 millions of /64;;'
+'28;28 bits -> 68719 millions of /64;;'
+'29;29 bits -> 34359 millions of /64;;'
+'30;30 bits -> 17179 millions of /64;;'
+'31;31 bits -> 8589 millions of /64;;'
+'32;32 bits -> 4294 millions of /64;;'
+'33;33 bits -> 2147 millions of /64;;'
+'34;34 bits -> 1073 millions of /64;;'
+'35;35 bits -> 536 millions of /64;;'
+'36;36 bits -> 268 millions of /64;;'
+'37;37 bits -> 134 millions of /64;;'
+'38;38 bits -> 67 millions of /64;;'
+'39;39 bits -> 33 millions of /64;;'
+'40;40 bits -> 16 millions of /64;;'
+'41;41 bits -> 8 millions of /64;;'
+'42;42 bits -> 4 millions of /64;;'
+'43;43 bits -> 2 millions of /64;;'
+'44;44 bits -> 1 millions of /64;;'
+'45;45 bits -> 0.5 million of /64;;'
+'46;46 bits -> 262144 of /64;;'
+'47;47 bits -> 131072 of /64;;'
+'48;48 bits -> 65536 of /64;;'
+'49;49 bits -> 32768 of /64;;'
+'50;50 bits -> 16384 of /64;;'
+'51;51 bits -> 8192 of /64;;'
+'52;52 bits -> 4096 of /64;;'
+'53;53 bits -> 2048 of /64;;'
+'54;54 bits -> 1024 of /64;;'
+'55;55 bits -> 512 of /64;;'
+'56;56 bits -> 256 of /64;;'
+'57;57 bits -> 128 of /64;;'
+'58;58 bits -> 64 of /64;;'
+'59;59 bits -> 32 of /64;;'
+'60;60 bits -> 16 of /64;;'
+'61;61 bits -> 8 of /64;;'
+'62;62 bits -> 4 of /64;;'
+'63;63 bits -> 2 of /64;;'
+'64;64 bits -> 1 of /64;;';
  }
  selectstrlist= selectstr.split(';;');
  var x = selectnbsubnet.childNodes;
  for (var i = x.length-1; i >=0 ; i--) {
    selectnbsubnet.removeChild(x[i]);
  }
  for (i=0;i<selectstrlist.length;i++) {
	var val = selectstrlist[i].split(';');
    var option=document.createElement("option");
	option.text=val[1];
	option.value=val[0];
	option.id='optionselectstr'+val[0];
	selectnbsubnet.add(option);
    selectnbsubnet.value=bits.value;	
  }
}

function openreadfile(datafile) {
  var fs = require('fs');
  var file = fs.readFileSync(datafile, "utf8");
  console.log(file);
  alert(data);
}

function browsertype(){
  var thisbrowser;
  if(document.layers){
    browser="netscape4";
  }
  if(document.all){
    browser="IE"
  }
  if(!document.all && document.getElementById){
    browser="netscape6";
  }
  return browser;
}

function settoggledPanel(pannel,val) {
  var pannelobj = document.getElementById(pannel);
  var toggleobj = document.getElementById('toggle'+pannel);
  /* the DOM variable above are for compatibility wit IE */
	if (val==1){
	    toggleobj.className = 'fa fa-toggle-on';
		pannelobj.style.display='';
	} else {
	    toggleobj.className = 'fa fa-toggle-off';
		pannelobj.style.display='none';
	};
}
function istoggledPanel(pannel) {
  var pannelobj = document.getElementById(pannel);
  var toggleobj = document.getElementById('toggle'+pannel);
  /* the DOM variable above are for compatibility wit IE */
  var ret;
	if (pannelobj.style.display==''){
		ret= 1;
	} else {
		ret= 0;
	};
  return ret;
}
function togglePanel(obj,pannelobj) {
	if (obj.className.indexOf('fa-toggle-off')>=0){
		obj.className='fa fa-toggle-on';
		pannelobj.style.display='';
	} else {
		obj.className='fa fa-toggle-off';
		pannelobj.style.display='none';
	};
}
