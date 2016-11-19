function boxesForGauss(sigma, n)  // standard deviation, number of boxes
{
    var wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width 
    var wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
    var wu = wl+2;

    var mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
    var m = Math.round(mIdeal);
    // var sigmaActual = Math.sqrt( (m*wl*wl + (n-m)*wu*wu - n)/12 );

    var sizes = [];  for(var i=0; i<n; i++) sizes.push(i<m?wl:wu);
    return sizes;
}

function gaussBlur_2 (scl, tcl, w, h, r) {
    var bxs = boxesForGauss(r, 3);
    boxBlur_2 (scl, tcl, w, h, (bxs[0]-1)/2);
    boxBlur_2 (tcl, scl, w, h, (bxs[1]-1)/2);
    boxBlur_2 (scl, tcl, w, h, (bxs[2]-1)/2);
}
function boxBlur_2 (scl, tcl, w, h, r) {
    for(var i=0; i<h; i++)
        for(var j=0; j<w; j++) {
            var val = 0;
            for(var iy=i-r; iy<i+r+1; iy++)
                for(var ix=j-r; ix<j+r+1; ix++) {
                    var x = Math.min(w-1, Math.max(0, ix));
                    var y = Math.min(h-1, Math.max(0, iy));
                    if ((i-iy) * (i-iy) + (j-ix) * (j-ix) >= r*r) continue;
                    val += scl[y*w+x];
                }
            tcl[i*w+j] = val/((r+r+1)*(r+r+1));
        }
}

function printMags(mags, w, h) {
  var temp = new Array(h);
  for (var i=0; i<h; i++) {
    temp[i] = new Array(w);
  }
  for (var i=0; i<h; i++) {
    for (var j=0; j<w; j++) {
      temp[i][j] = mags[i*w + j];
    }
  }
  console.log(temp);
}
//

//                    w  h 

/*
var mags1 = new Array(360*180);
for (var i = 0; i<360*180; i++) {
  mags1[i] = 0;
}
var mags2 = new Array(360*180);
for (var i = 0; i<36*18; i++) {
  mags2[i] = 0;
}

mags1[18*9] = 100;
printMags(mags1, 36, 18);
gaussBlur_2(mags1, mags2, 18, 36, 10);
printMags(mags2, 36, 18);
*/

function getBlurredData(arr) {
  var M = new Array(360*180);
  for (var i=0; i<360*180; i++) {
    M[i] = 0;
  }
  for (var i = 0; i < arr.length; i++) {
    var x = Math.floor(arr[i].lat) ;
    var y = Math.floor(arr[i].lng);
    var mag = arr[i].mag;
    M[(y+90)*360 + x+180] = mag;
  }
  console.log(M);
  var M2 = new Array(360*180);
  for (var i=0; i<360*180; i++) {
    M2[i] = 0;
  }
  gaussBlur_2(M, M2, 360, 180, 7);
  console.log(M2);
  var res = [];
  for (var i=0; i<180; i++) {
    for (var j=0; j<360; j++) {
      if (!M2[i*360 + j]) continue;
      res.push(i-90);
      res.push(j-180);
      res.push(M2[i*360 + j]);
    }
  }
  return res;
}

var mags = [
  {
    lat: 0,
    lng: 0,
    mag: 100
  },
  {
    lat: 45,
    lng: 45,
    mag: 25
  },
  {
    lat: 5,
    lng: 10,
    mag: 75
  }
];
var mydata = getBlurredData(mags);
