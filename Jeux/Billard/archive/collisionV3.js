var balles = new Array();
var tmp = null;
var d=true ; //debug = true
var minx=10,miny=30,maxx=440,maxy=230; //position absolu de la fenetre de jeux
var rad2deg=180/Math.PI; //conversion du radian au degres
var deg2rad=Math.PI/180; //conversion du degres au radian
var cas_extreme=0;
var coefLin=0.005 ; //coeficient de ralentissement (décroissance liénaire)
var seuilStop=0.1; // stop le deplacement si vitesse<seuil
//creation de la bille
function Balle(id,x,y,a,v,r)
{
	this.id = id; //identifiant
	this.x =x; //position x
	this.nx =x; // prochaine position -> pour les chocs
	this.y =y;
	this.ny =y;
//TODO: remplacer angle,vitesse par dx & dy (+rapide pr les calculs)
	this.a = a; //angle
	this.v = v; //vitesse
	this.m = 4; //masse
	this.r = r; //rayon
	this.bouge =true; //patch pour eviter les chevauchements
}

//pr simplifier les appel des objets
function _(idx) 
	{return document.getElementById(idx);}	
function _v(idx) 
	{return parseFloat(document.getElementById(idx).value,10);}

//initialisation/reset code=true -> debut du deplacement
function depart(code)
{
	if(d&!code)
	{
	//retourne les propriétés d'un div
	//getProp(_("ecran"));
	}
	
	//Retourne l'air du plateau + onresize
	getPosition();

	if (tmp!=null)
		{clearTimeout(tmp);}
	balles = new Array();
	
	cas_extreme=_v("cas");
	a_v1 = _v("a1");
	v_v1 = _v("v1");
	coefLin = _("frein").checked?0.005:0;
	switch(cas_extreme)
	{
	case 0: //mode billard
	{
	//d=false;
	n=0;
	for (x=0;x<5;x++)
		for (y=0;y<x;y++)
			{
			balles.push(new Balle("r"+n,270+x*15,150-y*15-(5-x)*7.5,0,0,7));		
			n++;
			}
	}; break;
	case 1: //choc Horizontal
	a_v1=0;	v_v1=1;
	balles.push(new Balle("r1",200,120,0,-1,7));		
	break;	
	case 2: //choc Vertical
	a_v1=90;	v_v1=1;
	balles.push(new Balle("r1",120,200,90,-1,7));		
	break;	
	case 3: // diagonale opposé
	a_v1=45;	v_v1=1;
	balles.push(new Balle("r1",200,200,45,-1,7));		
	break;	
	case 4: // diagonale même sens
	a_v1=45;	v_v1=.5;
	balles.push(new Balle("r1",50,50,45,1.5,7));		
	break;	
	}
	balles.push(new Balle("b1",_v("x1"),_v("y1"),a_v1,v_v1,7));
	
	//affiche les boules a l'ecran
	ajoutBalle();
	//si code =true alors demarre les deplacements
	if (code)
	{
	boucle();
	}
}

function getPosition()
{
	//position de l'air du plateau, ok sous IE & firefox
	minx=parseInt(_("ecran").offsetLeft,10);
	miny=parseInt(_("ecran").offsetTop,10);
	maxx=parseInt(_("ecran").offsetWidth,10);
	maxy=parseInt(_("ecran").offsetHeight,10);
}
//retourne les proprietes d'un objet
function getProp(x)
{
	htm="";
	for (e in x)
	htm+=e+":"+x[e]+"<br>";
	_("debug_").innerHTML=htm;
}

//boucle de deplacement
function boucle()
{
	//deplace les boules
	bougeMoi();
	//test les chocs contre les murs et entre les boules
	testChoc();
	//replace les boules
	placeMoi();
	//relance la fonction apres 10ms
	//a ajuster en fonction de la vitesse de la machine
	tmp = setTimeout("boucle()",10);
}

function testChoc()
{
for (e=0;e<balles.length;e++)
	{
	b=balles[e];
		//collision avec les murs
	if (b.nx<b.r) {b.nx=b.r; b.a = 180-b.a;}
	if ((b.nx+b.r)>maxx) {b.nx=maxx-b.r; b.a = 180-b.a;}
	if (b.ny<b.r) {b.ny=b.r; b.a = -b.a;}
	if ((b.ny+b.r)>maxy) {b.ny=maxy-b.r; b.a = -b.a;}
	}

for (e=0;e<balles.length;e++)
{
	b=balles[e];
	 for (k=e+1;k<balles.length;k++)
	{
	  bk=balles[k];
	  //distance entre 2 balles < sommes des 2 rayons //version light pr la vitesse d'execution
	  distn=(b.nx-bk.nx)*(b.nx-bk.nx)+(b.ny-bk.ny)*(b.ny-bk.ny);	  
	  if ((distn<=((b.r+bk.r)*(b.r+bk.r)))&&(b.v>0||bk.v>0)) 
	  {
		collision(b,bk);
		b.bouge=false;
	  }
	}
}
//attribue les nouvelles positions à la boule
for (e=0;e<balles.length;e++)	
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

//même version mais en + rapide
function collision(aa,bb)
{
angle= Math.atan2(bb.ny-aa.ny,bb.nx-aa.nx);  //dy/dx
ra=aa.a*deg2rad;rb=bb.a*deg2rad;m2=aa.m+bb.m;//constante pr eviter les recalculs
ca=Math.cos(angle); sa=Math.sin(angle);
//if (d) alert("aa [angle depart="+aa.a+", vitesse="+aa.v+"]\nbb [angle depart="+bb.a+", vitesse="+bb.v+"]\n angle collision="+angle*rad2deg);
//calcul des vitesses normal et perpendiculaire au choc
va_norm=aa.v*Math.cos(-ra+angle);
va_perp=aa.v*Math.sin(-ra+angle);
vb_norm=bb.v*Math.cos(-rb+angle);
vb_perp=bb.v*Math.sin(-rb+angle);
//if (d) alert("va_norm :"+va_norm+", va_perp :"+va_perp+"\nvb_norm :"+vb_norm+", vb_perp :"+vb_perp);

//conservation energie
va2_norm=( (aa.m-bb.m)/m2)*va_norm+( (2*bb.m)/m2 )*vb_norm;
vb2_norm=( (bb.m-aa.m)/m2)*vb_norm+( (2*aa.m)/m2 )*va_norm;

//if (d) alert("va2_norm :"+va2_norm+", vb2_norm :"+vb2_norm);

//nouvelle position, on resort ses cours de maths
va2x=va2_norm*ca-va_perp*Math.cos(angle+Math.PI/2); //cos(a+PI/2) = -sin(a)
va2y=va2_norm*sa-va_perp*Math.sin(angle+Math.PI/2); //sin(a+PI/2) = cos(a)
vb2x=vb2_norm*ca-vb_perp*Math.cos(angle+Math.PI/2);
vb2y=vb2_norm*sa-vb_perp*Math.sin(angle+Math.PI/2);

//if (d) alert("va2x :"+va2x+", va2y :"+va2y+"\nvb2x :"+vb2x+", vb2y :"+vb2y);

//recalcul angle + vitesse
aa.v = Math.sqrt(va2x*va2x+va2y*va2y);
bb.v = Math.sqrt(vb2x*vb2x+vb2y*vb2y);
aa.a = Math.atan2(va2y,va2x)*rad2deg;
bb.a = Math.atan2(vb2y,vb2x)*rad2deg;
}

//effecute le deplacement de la boule
function bougeMoi()
{
	htm="";
	for (e=0;e<balles.length;e++)
	{
	b=balles[e];
	//seuil de deplacement avant stop
	if (b.v<seuilStop)
		b.v=0;
	//b.v*=0.998;
	b.v-=coefLin;	
		//retourne un angle entre 0 & 360
	if (b.a<0)
		do {b.a+=360;} while(b.a<0);
	if (b.a>360)
		do {b.a-=360;} while(b.a>360);	
	nx=b.x;ny=b.y;
	if (b.v>0) //en javascript 0*cos(a) <>0 ???
		{
		nx = b.x+b.v*Math.cos(b.a*deg2rad);
		ny = b.y+b.v*Math.sin(b.a*deg2rad);
		}
//TODO: il faudrait trouver un truc ici pr eviter que les boules se chevauche
	b.nx=nx;
	b.ny=ny;
	//si mode debug on affiche les info de positions
	//if (d)
		htm+="a :"+parseInt(b.a,10)+" - x :"+parseInt(nx,10)+" - y :"+parseInt(ny,10)+" - v :"+parseInt(b.v*100)/100+"<br>";
	}
if (d) 
	_("debug_").innerHTML=htm;

}

//replace les boules au bonne positions
function placeMoi()
{
	for (e in balles)
	{
		b=balles[e];
		_(b.id).style.left=parseInt(b.x,10)-b.r+minx;
		_(b.id).style.top=parseInt(b.y,10)-b.r+miny;
	}
}

//places les elements à l'ecran
function ajoutBalle()
{
htm="";
for (e in balles)
{
b=balles[e];
htm+="<img id='"+b.id+"' src='balle.png' style='position:absolute; top:"+(b.y-b.r+miny)+"px;left:"+(b.x-b.r+minx)+"px;width:"+(b.r*2)+"px;height:"+(b.r*2)+"px;'>";
}
_("ecran").innerHTML = htm;
}
