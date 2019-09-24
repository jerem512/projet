Billard en javascript c'est possible !--------------------------------------
Url     : http://codes-sources.commentcamarche.net/source/49749-billard-en-javascript-c-est-possibleAuteur  : amrounixDate    : 03/08/2013
Licence :
=========

Ce document intitulé « Billard en javascript c'est possible ! » issu de CommentCaMarche
(codes-sources.commentcamarche.net) est mis à disposition sous les termes de
la licence Creative Commons. Vous pouvez copier, modifier des copies de cette
source, dans les conditions fixées par la licence, tant que cette note
apparaît clairement.

Description :
=============

Hello tout le monde, 
<br />je reviens en force avec un petit jeu que je suis e
n train de terminer, un jeu de billard en full javascript !
<br />-le programme
 est bas&eacute; sur mon moteur de collision encore quelques tout petits bugs su
r les chocs (cas extr&ecirc;mes qui n'arrive pas souvent)
<br />-la queue de bi
llard est dessin&eacute;e &agrave; partir de l'algorithme de Bresenham (tracage 
de segement) + une modif perso pour l'&eacute;paisseur de la droite
<br />
<br
 />vous pouvez d&eacute;j&agrave; commencer &agrave; voir un aper&ccedil;u du fu
tur jeu, m&ecirc;me si il n'est pas encore finalis&eacute;! 
<br />M&ecirc;me s
i il reste une grosse partie &agrave; faire, j'ai programm&eacute; la partie la 
plus difficile !
<br />
<br />20/04/09 : ajout d'une m&eacute;thode ultra rapi
de qui d&eacute;tecte les croisements de segements, cela me permet de d&eacute;t
ecter les rebords + les trous, les rebonds se font d&eacute;sorm&eacute;s en fon
ction de l'angle du rebord ... :)
<br />dans le jeux cela correspond &agrave; l
'encadr&eacute; en rouge (pour enlever l'affichage tu rectangle rouge, remplacer
 dans le source &quot;var d=true;&quot; par &quot;var d=false;&quot;
<br /><a n
ame='source-exemple'></a><h2> Source / Exemple : </h2>
<br /><pre class='code'
 data-mode='basic'>
var balles = new Array();
var tmp = null;
var d=false ; /
/debug = true
var minx=10,miny=30,maxx=440,maxy=230; //position absolu de la fe
netre de jeux
var rad2deg=180/Math.PI; //conversion du radian au degres
var de
g2rad=Math.PI/180; //conversion du degres au radian
var coefLin=0.005 ; //coefi
cient de ralentissement (décroissance liénaire)
var seuilStop=0.1; // stop le d
eplacement si vitesse&lt;seuil
var	a_v1 = 0, v_v1 = 5;
var pause = true;
var 
col=<a href='/*j*/1,/**/2,1,/**/1,3,2,/**/2,1,2,1,/**/1,2,1,2,2'>/*j*/1,/**/2,1,
/**/1,3,2,/**/2,1,2,1,/**/1,2,1,2,2</a>;	
var src=['blanche','jaune','rouge','n
oir']
var fichier
//distance &amp; force maxi de la queue
var dmin = 10, dmax
 = 70, fmax = 30;

//creation de la bille
function Balle(id,x,y,a,v,r,t)
{

	this.id = id; //identifiant
	this.x =x; //position x
	this.nx =x; // prochain
e position -&gt; pour les chocs
	this.y =y;
	this.ny =y;
//TODO: remplacer an
gle,vitesse par dx &amp; dy (+rapide pr les calculs)
	this.a = a; //angle
	thi
s.v = v; //vitesse
	this.m = 4; //masse
	this.r = r; //rayon
	this.t = t; //c
ouleur/type de la balle
	this.bouge =true; //patch pour eviter les chevauchemen
ts
}

/*creation de la queue
angle : angle entre queue et boule 
deltaF : d
istance de la boule en fonction de la force
posX,posY : position de la boule


<ul><li>/</li></ul>
function dessinQueue(angle,deltaForce,posX,posY)
{
	Lq =
 200; // longueur de la queue	
	pcos=Math.cos(angle);
	psin=Math.sin(angle);

	xmin= posX+(dmin+deltaForce)*pcos;
	ymin= posY+(dmin+deltaForce)*psin;
	xmoy=
 posX+(dmin+deltaForce+10)*pcos;
	ymoy= posY+(dmin+deltaForce+10)*psin;
	xmax=
 posX+(dmin+deltaForce+Lq)*pcos;
	ymax= posY+(dmin+deltaForce+Lq)*psin;	

	ht
m=ligne2(xmin,ymin,xmoy,ymoy,6,'#c0c0c0');//embout
	htm+=ligne2(xmoy,ymoy,xmax,
ymax,6,'brown');	
	
	return htm;
}

/*
convertie position souris
en angle
 + distance =&gt; force

<ul><li>/</li></ul>
function bougerQ(px,py)
{
//co
ordonnée de la balle blanche
var posX = balles[0].x,posY = balles[0].y;
py-=mi
ny;px-=minx;
a_v1= Math.atan2(py-posY,px-posX);
deltaForce= Math.sqrt((py-posY
)*(py-posY)+(px-posX)*(px-posX));
deltaForce=((deltaForce+dmin)&gt;dmax) ? dmax
 : deltaForce;
deltaForce=(deltaForce&lt;dmin) ? dmin : deltaForce;
v_v1 = del
taForce/10;
balles[0].a = a_v1 * rad2deg + 180;
balles[0].v = v_v1;
_(&quot;e
cran2&quot;).innerHTML=dessinQueue(a_v1,deltaForce,posX,posY);
}
/*
capture d
eplacement de la souris
(onmousemove)

<ul><li>/</li></ul>
function bougerQu
eue(event)
{
var ev = event || window.event;
//getProp(ev);
if (pause)
	{

	tmp=setTimeout(&quot;bougerQ(&quot;+(ev.pageX||ev.clientX)+&quot;,&quot;+(ev.pa
geY||ev.clientY)+&quot;)&quot;,10);
	}
}

/*
capture clic de la souris
(on
click)

<ul><li>/</li></ul>
function tirer()
{
pause=false;
_(&quot;ecran2
&quot;).innerHTML=&quot;&quot;;
boucle();	
}

//pr simplifier les appel des 
objets
function _(idx) 
	{return document.getElementById(idx);}	
function _v(
idx) 
	{return parseFloat(document.getElementById(idx).value,10);}

//initial
isation/reset 
function depart()
{
	//Retourne l'air du plateau + onresize
	
getPosition();

	//efface tempo
	if (tmp!=null)
		{clearTimeout(tmp);}
	
	
//lise des boules
	balles = new Array();

	//coefficient de freinage
	//decr
oissance linéaire
	coefLin = 0.005;
	
	//ajout de la boule blanche
	balles.p
ush(new Balle(&quot;b1&quot;,120,120,a_v1,v_v1,8.5,0));
	blanche=balles[0];
	

	//d=false;
	//ajout des boules + disposition en triangle
	n=0;
	for (x=0;x&
lt;6;x++)
		for (y=0;y&lt;x;y++)
			{
			balles.push(new Balle(&quot;r&quot;+
n,270+x*20,150-y*20-(5-x)*10,0,0,9,col[n]));		
			n++;
			}

	//affiche les 
boules a l'ecran
	ajoutBalle();
	//associe les evenements
	document.onmousemo
ve=bougerQueue;
}

function getPosition()
{
	//position de l'air du plateau
, ok sous IE &amp; firefox
	minx=parseInt(_(&quot;ecran&quot;).offsetLeft,10);

	miny=parseInt(_(&quot;ecran&quot;).offsetTop,10);
	maxx=parseInt(_(&quot;ecra
n&quot;).offsetWidth,10);
	maxy=parseInt(_(&quot;ecran&quot;).offsetHeight,10);

	
	//ajuste le div de la queue
	_(&quot;ecran2&quot;).style.left=minx;
	_(&
quot;ecran2&quot;).style.top=miny;
	_(&quot;ecran2&quot;).style.width=maxx;
	_
(&quot;ecran2&quot;).style.height=maxy;
	
}

//retourne les proprietes d'un 
objet (debug)
function getProp(x)
{
	htm=&quot;&quot;;
	for (e in x)
	htm+=
e+&quot;:&quot;+x[e]+&quot;&lt;br&gt;&quot;;
	_(&quot;debug_&quot;).innerHTML=h
tm;
}

//boucle de deplacement
function boucle()
{
	//deplace les boules

	bougeMoi();
	//test les chocs contre les murs et entre les boules
	testChoc()
;
	//replace les boules
	placeMoi();
	//relance la fonction apres 10ms
	//a 
ajuster en fonction de la vitesse de la machine
	if (!pause)
		{
		tmp = setT
imeout(&quot;boucle()&quot;,10);
		}
}

function testChoc()
{
for (e=0;e&l
t;balles.length;e++)
	{
	b=balles[e];
		//collision avec les murs
	if (b.nx&
lt;b.r) {b.nx=b.r; b.a = 180-b.a;}
	if ((b.nx+b.r)&gt;maxx) {b.nx=maxx-b.r; b.a
 = 180-b.a;}
	if (b.ny&lt;b.r) {b.ny=b.r; b.a = -b.a;}
	if ((b.ny+b.r)&gt;maxy
) {b.ny=maxy-b.r; b.a = -b.a;}
	}

for (e=0;e&lt;balles.length;e++)
{
	b=ba
lles[e];
	 for (k=e+1;k&lt;balles.length;k++)
	{
	  bk=balles[k];
	  //dista
nce entre 2 balles &lt; sommes des 2 rayons //version light pr la vitesse d'exec
ution
	  distn=(b.nx-bk.nx)*(b.nx-bk.nx)+(b.ny-bk.ny)*(b.ny-bk.ny);	  
	  if (
(distn&lt;=((b.r+bk.r)*(b.r+bk.r)))&amp;&amp;(b.v&gt;0||bk.v&gt;0)) 
	  {
		co
llision(b,bk);
		b.bouge=false;
	  }
	}
}
//attribue les nouvelles position
s à la boule
for (e=0;e&lt;balles.length;e++)	
	{
	b=balles[e];
	if(b.bouge)

	{
	b.x = b.nx;
	b.y = b.ny;
	}
	b.bouge=true;
	}
}

//test de collisi
on
function collision(aa,bb)
{
angle= Math.atan2(bb.ny-aa.ny,bb.nx-aa.nx);  /
/dy/dx
ra=aa.a*deg2rad;rb=bb.a*deg2rad;m2=aa.m+bb.m;//constante pr eviter les r
ecalculs
ca=Math.cos(angle); sa=Math.sin(angle);
//if (d) alert(&quot;aa [angl
e depart=&quot;+aa.a+&quot;, vitesse=&quot;+aa.v+&quot;]\nbb [angle depart=&quot
;+bb.a+&quot;, vitesse=&quot;+bb.v+&quot;]\n angle collision=&quot;+angle*rad2de
g);
//calcul des vitesses normal et perpendiculaire au choc
va_norm=aa.v*Math.
cos(-ra+angle);
va_perp=aa.v*Math.sin(-ra+angle);
vb_norm=bb.v*Math.cos(-rb+an
gle);
vb_perp=bb.v*Math.sin(-rb+angle);
//if (d) alert(&quot;va_norm :&quot;+v
a_norm+&quot;, va_perp :&quot;+va_perp+&quot;\nvb_norm :&quot;+vb_norm+&quot;, v
b_perp :&quot;+vb_perp);

//conservation energie
va2_norm=( (aa.m-bb.m)/m2)*v
a_norm+( (2*bb.m)/m2 )*vb_norm;
vb2_norm=( (bb.m-aa.m)/m2)*vb_norm+( (2*aa.m)/m
2 )*va_norm;

//if (d) alert(&quot;va2_norm :&quot;+va2_norm+&quot;, vb2_norm 
:&quot;+vb2_norm);

//nouvelle position, on resort ses cours de maths
va2x=va
2_norm*ca-va_perp*Math.cos(angle+Math.PI/2); //cos(a+PI/2) = -sin(a)
va2y=va2_n
orm*sa-va_perp*Math.sin(angle+Math.PI/2); //sin(a+PI/2) = cos(a)
vb2x=vb2_norm*
ca-vb_perp*Math.cos(angle+Math.PI/2);
vb2y=vb2_norm*sa-vb_perp*Math.sin(angle+M
ath.PI/2);

//if (d) alert(&quot;va2x :&quot;+va2x+&quot;, va2y :&quot;+va2y+&
quot;\nvb2x :&quot;+vb2x+&quot;, vb2y :&quot;+vb2y);

//recalcul angle + vites
se
aa.v = Math.sqrt(va2x*va2x+va2y*va2y);
bb.v = Math.sqrt(vb2x*vb2x+vb2y*vb2y
);
aa.a = Math.atan2(va2y,va2x)*rad2deg;
bb.a = Math.atan2(vb2y,vb2x)*rad2deg;

}

//effecute le deplacement de la boule
function bougeMoi()
{
	htm=&quot
;&quot;;
	stopper = false;
	for (e=0;e&lt;balles.length;e++)
	{
	b=balles[e]
;
	//seuil de deplacement avant stop
	if (b.v&lt;seuilStop)
		b.v=0;
	if (b.
v&gt;0 &amp;&amp; !stopper) 
		stopper = true;
	//b.v*=0.998;
	b.v-=coefLin;	

		//retourne un angle entre 0 &amp; 360
	if (b.a&lt;0)
		do {b.a+=360;} whil
e(b.a&lt;0);
	if (b.a&gt;360)
		do {b.a-=360;} while(b.a&gt;360);	
	nx=b.x;ny
=b.y;
	if (b.v&gt;0) //en javascript 0*cos(a) &lt;&gt;0 ???
		{
		nx = b.x+b.
v*Math.cos(b.a*deg2rad);
		ny = b.y+b.v*Math.sin(b.a*deg2rad);
		}
//TODO: il
 faudrait trouver un truc ici pr eviter que les boules se chevauche
	b.nx=nx;

	b.ny=ny;
	//si mode debug on affiche les info de positions
	//if (d)
		htm+=
&quot;a :&quot;+parseInt(b.a,10)+&quot; - x :&quot;+parseInt(nx,10)+&quot; - y :
&quot;+parseInt(ny,10)+&quot; - v :&quot;+parseInt(b.v*100)/100+&quot;&lt;br&gt;
&quot;;
	}
	if (!stopper) {
	//alert('stop');
	pause = true;
	}
	//pause =
 !stopper;
if (d) 
	_(&quot;debug_&quot;).innerHTML=htm;

}

//replace les
 boules au bonne positions
function placeMoi()
{
	for (e in balles)
	{
		b=
balles[e];
		_(b.id).style.left=parseInt(b.x,10)-b.r+minx;
		_(b.id).style.top
=parseInt(b.y,10)-b.r+miny;
	}
}

//places les elements à l'ecran
function 
ajoutBalle()
{
htm=&quot;&quot;;
for (e in balles)
{
b=balles[e];
htm+=&qu
ot;&lt;img id='&quot;+b.id+&quot;' src='img/&quot;+src[b.t]+&quot;.png' style='p
osition:absolute; top:&quot;+(b.y-b.r+miny)+&quot;px;left:&quot;+(b.x-b.r+minx)+
&quot;px;width:&quot;+(b.r*2)+&quot;px;height:&quot;+(b.r*2)+&quot;px;'&gt;&quot
;;
}
_(&quot;ecran&quot;).innerHTML = htm;
}

//---------------------------
----------
//-------------------------------------

function ajoutPix(x, y, l
, h, c)
{
	return &quot;&lt;div style='left:&quot;+x+&quot;px;top:&quot;+y+&qu
ot;px;width:&quot;+l+&quot;px;height:&quot;+h+&quot;px;background-color:&quot;+c
+&quot;;overflow:hidden;position:absolute;'&gt;&lt;\/div&gt;&quot;;
}

/*
tr
acer d'une droite avec l'algorithme Bresenham
-modifié pour créer un effet d'ep
aisseur 
x1,y1,x2,y2 : coordonnée du segment
diam : diametre du segment
c : c
ouleur

<ul><li>/</li></ul>

function ligne2(x1, y1, x2, y2, diam, c)
{
ht
m=&quot;&quot;;
if (c==null) 
	c=&quot;black&quot;; //couleur par defaut
if (
diam==null) 
	diam=2; //epaiseur par defaut	
	if(x1 &gt; x2)
	{
	//swap(x1,x
2);
		var z = x2;x2 = x1;x1 = z;
		z = y2;y2 = y1;y1 = z;
	}
	var dx = x2-x1
, dy = Math.abs(y2-y1); //delta x &amp; y
	var x = x1, y = y1;
	var ySens = (y
1 &gt; y2)? -1 : 1; //direction de Y
	
	if(dx &lt; dy)
		{
		var d2 = diam&g
t;&gt;1; //equivalent à Math.round(diam/2);

		var dxy = 2*(dx - dy),
		p = 2
*dx-dy,
		py = y;
		
		if(y2 &gt; y1)
		{
			while(dy &gt; 0)
			{   --dy;

				y += ySens;
				if(p &gt; 0)
				{
					htm+=ajoutPix(x++, py, diam, y-
py+d2,c);
					p += dxy;
					py = y;
				}
				else p += 2*dx;
			}
			ht
m+=ajoutPix(x2, py, diam, y2-py+d2+1,c);
		}
		else
		{
			while(dy &gt; 0)

			{--dy;
				if(p &gt; 0)
				{
					htm+=ajoutPix(x++, y, diam, py-y+d2,c)
;
					y += ySens;
					p += dxy;
					py = y;
				}
				else
				{
					
y += ySens;
					p += 2*dx;
				}
			}
			htm+=ajoutPix(x2, y2, diam, py-y2+
d2,c);
		}
	}
	else
	{
		var dxy = 2*(dy - dx),
		p = 2*dy-dx,
		px = x;

		d2 = diam&gt;&gt;1 ;
		
		while(dx &gt; 0)
		{--dx;
			++x;
			if(p &gt;
 0)
			{
				htm+=ajoutPix(px, y, x-px+d2, diam,c);
				y += ySens;
				p +=
 dxy;
				px = x;
			}
			else p += 2*dy;
		}
		htm+=ajoutPix(px, y, x2-px+
d2+1, diam,c);
	}
	return htm;
}
</pre>
