document.write(`
    
    <style>
 
    #e_tientv_left {
        position: fixed;
        top: 0;
        left: 0;
        width: 200px;
        z-index: 1;
        display: none;
        cursor: pointer;
        transition: display 0.3s ease-in-out;
    }


  @media (min-width: 992px) {
    #e_tientv_left, #e_tientv_right, #e_tientv_footer, #e_tientv_bottom_left {
      display: block;
    }
  }
</style>
<img id="e_tientv_left" src="https://tientv.com/hoa/topleft.png"/>
    
    
    `)

  var no = 20;
  var hidesnowtime = 0;
  var snowdistance = 'pageheight';
  var ie4up = (document.all) ? 1 : 0;
  var ns6up = (document.getElementById && !document.all) ? 1 : 0;

  function iecompattest() {
    return (document.compatMode && document.compatMode != 'BackCompat') ? document.documentElement : document.body;
  }

  var dx, xp, yp, am, stx, sty;
  var i, doc_width = 800, doc_height = 600;

  if (ns6up) {
    doc_width = self.innerWidth;
    doc_height = self.innerHeight;
  } else if (ie4up) {
    doc_width = iecompattest().clientWidth;
    doc_height = iecompattest().clientHeight;
  }

  dx = [];
  xp = [];
  yp = [];
  am = [];
  stx = [];
  sty = [];

  for (i = 0; i < no; ++i) {
    dx[i] = 0;
    xp[i] = Math.random() * (doc_width - 50);
    yp[i] = Math.random() * doc_height;
    am[i] = Math.random() * 20;
    stx[i] = 0.02 + Math.random() / 10;
    sty[i] = 0.7 + Math.random();

    if (ie4up || ns6up) {
      document.write('<div id="dot' + i + '" style="POSITION:absolute;Z-INDEX:' + i + ';VISIBILITY:visible;TOP:15px;LEFT:15px;"><span style="font-size:18px;color:#fff">✽</span></div>');
    }
  }

  function snowIE_NS6() {
    doc_width = ns6up ? window.innerWidth - 10 : iecompattest().clientWidth - 10;
    doc_height = (window.innerHeight && snowdistance == 'windowheight') ? window.innerHeight :
      (ie4up && snowdistance == 'windowheight') ? iecompattest().clientHeight :
      (ie4up && !window.opera && snowdistance == 'pageheight') ? iecompattest().scrollHeight : iecompattest().offsetHeight;

    for (i = 0; i < no; ++i) {
      yp[i] += sty[i];
      if (yp[i] > doc_height - 50) {
        xp[i] = Math.random() * (doc_width - am[i] - 30);
        yp[i] = 0;
        stx[i] = 0.02 + Math.random() / 10;
        sty[i] = 0.7 + Math.random();
      }
      dx[i] += stx[i];
      document.getElementById('dot' + i).style.top = yp[i] + 'px';
      document.getElementById('dot' + i).style.left = xp[i] + am[i] * Math.sin(dx[i]) + 'px';
    }

    snowtimer = setTimeout('snowIE_NS6()', 10);
  }

  function hidesnow() {
    if (window.snowtimer) {
      clearTimeout(snowtimer);
    }
    for (i = 0; i < no; i++) {
      document.getElementById('dot' + i).style.visibility = 'hidden';
    }
  }

  if (ie4up || ns6up) {
    snowIE_NS6();
    if (hidesnowtime > 0) {
      setTimeout('hidesnow()', hidesnowtime * 1000);
    }
  }


