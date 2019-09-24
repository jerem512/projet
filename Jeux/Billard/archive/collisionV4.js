var balles = new Array();
var tmp = null;
var d=false ; //debug = true
var minx=10,miny=30,maxx=440,maxy=230; //position absolu de la fenetre de jeux
var rad2deg=180/Math.PI; //conversion du radian au degres
var deg2rad=Math.PI/180; //conversion du degres au radian
var coefLin=0.01 ; //coeficient de ralentissement (décroissance liénaire)
var seuilStop=0.1; // stop le deplacement si vitesse<seuil
var	a_v1 = 0, v_v1 = 5;
var pause = true;
var col=[/*j*/1,/**/2,1,/**/1,3,2,/**/2,1,2,1,/**/1,2,1,2,2];	
var src=['blanche','jaune','rouge','noir'];
//distance & force maxi de la queue
var dmin = 10, dmax = 70, fmax = 50;
var rebord= new Array();

//creation de la bille
function Balle(id,x,y,a,v,r,t)
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
	this.t = t; //couleur/type de la balle
	this.bouge =true; //patch pour eviter les chevauchements
}

/*creation de la queue
angle : angle entre queue et boule 
deltaF : distance de la boule en fonction de la force
posX,posY : position de la boule
*/
function dessinQueue(angle,deltaForce,posX,posY)
{
	Lq = 200; // longueur de la queue	
	pcos=Math.cos(angle);
	psin=Math.sin(angle);
	xmin= posX+(dmin+deltaForce)*pcos;
	ymin= posY+(dmin+deltaForce)*psin;
	xmoy= posX+(dmin+deltaForce+5)*pcos;
	ymoy= posY+(dmin+deltaForce+5)*psin;
	xmoy2= posX+(dmin+deltaForce+15)*pcos;
	ymoy2= posY+(dmin+deltaForce+15)*psin;
	xmoy3= posX+(dmin+deltaForce+60)*pcos;
	ymoy3= posY+(dmin+deltaForce+60)*psin;
	xmoy4= posX+(dmin+deltaForce+64)*pcos;
	ymoy4= posY+(dmin+deltaForce+64)*psin;
	xmax= posX+(dmin+deltaForce+Lq)*pcos;
	ymax= posY+(dmin+deltaForce+Lq)*psin;	

	htm=ligne2(xmin,ymin,xmoy,ymoy,6,'#c0c0c0');//embout
	htm+=ligne2(xmoy,ymoy,xmoy2,ymoy2,6,'lightyellow');//embout
	htm+=ligne2(xmoy2,ymoy2,xmoy3,ymoy3,6,'brown');//embout
	htm+=ligne2(xmoy3,ymoy3,xmoy4,ymoy4,6,'yellow');//embout	
	htm+=ligne2(xmoy4,ymoy4,xmax,ymax,7,'brown');	
	
	return htm;
}

/*
convertie position souris
en angle + distance => force
*/
function bougerQ(px,py)
{
//coordonnée de la balle blanche
var posX = balles[0].x,posY = balles[0].y;
py-=miny;px-=minx;
a_v1= Math.atan2(py-posY,px-posX);
deltaForce= Math.sqrt((py-posY)*(py-posY)+(px-posX)*(px-posX));
deltaForce=((deltaForce+dmin)>dmax) ? dmax : deltaForce;
deltaForce=(deltaForce<dmin) ? dmin : deltaForce;
v_v1 = deltaForce/10;
balles[0].a = a_v1 * rad2deg + 180;
balles[0].v = v_v1;
_("ecran2").innerHTML=dessinQueue(a_v1,deltaForce,posX,posY);
}
/*
capture deplacement de la souris
(onmousemove)
*/
function bougerQueue(event)
{
var ev = event || window.event;
//getProp(ev);
if (pause)
	{
	tmp=setTimeout("bougerQ("+(ev.pageX||ev.clientX)+","+(ev.pageY||ev.clientY)+")",10);
	}
}

/*
capture clic de la souris
(onclick)
*/
function tirer()
{
pause=false;
_("ecran2").innerHTML="";
boucle();	
}

//pr simplifier les appel des objets
function _(idx) 
	{return document.getElementById(idx);}	
function _v(idx) 
	{return parseFloat(document.getElementById(idx).value,10);}

//initialisation/reset 
function depart()
{
	//Retourne l'air du plateau + onresize
	getPosition();
	
	rebord= new Array();
	//zone de collision avec les rebords
	ray=11; //Rayon de la boule
	//haut
	rebord.push({xmin:0,ymin:ray-25,xmax:30,ymax:ray,n:135,r:true});
	rebord.push({xmin:30,ymin:ray,xmax:((maxx>>1)-20),ymax:ray,n:90,r:true});
	rebord.push({xmin:((maxx>>1)-20),ymin:ray,xmax:((maxx>>1)-10),ymax:ray-30,n:45,r:true});

	rebord.push({xmin:((maxx>>1)-10),ymin:ray-30,xmax:((maxx>>1)+10),ymax:ray-30,n:90,r:false});
	
	rebord.push({xmin:((maxx>>1)+10),ymin:ray-30,xmax:((maxx>>1)+28),ymax:ray,n:135,r:true});
	rebord.push({xmin:((maxx>>1)+28),ymin:ray,xmax:(maxx-25),ymax:ray,n:90,r:true});
	rebord.push({xmin:(maxx-25),ymin:ray,xmax:(maxx-2),ymax:ray-22,n:45,r:true});

	rebord.push({xmin:(maxx-2),ymin:ray-22,xmax:(maxx+24-ray),ymax:0,n:135,r:false});
	
	//droite
	rebord.push({xmin:(maxx+24-ray),ymin:0,xmax:maxx-ray,ymax:22,n:225,r:true});	
	rebord.push({xmin:maxx-ray,ymin:22,xmax:maxx-ray,ymax:(maxy-22),n:180,r:true});	
    rebord.push({xmin:maxx-ray,ymin:(maxy-22),xmax:(maxx+18-ray),ymax:maxy,n:135,r:true});	 
	
	rebord.push({xmax:maxx,ymax:(maxy+28-ray),xmin:(maxx+18-ray),ymin:maxy,n:225,r:false});
	
	//bas - droite
	rebord.push({xmin:maxx,ymin:(maxy+28-ray),xmax:(maxx-28),ymax:maxy-ray,n:315,r:true});	 		
	rebord.push({xmin:(maxx-30),ymin:maxy-ray,xmax:((maxx>>1)+20),ymax:maxy-ray,n:270,r:true});	
	rebord.push({xmin:((maxx>>1)+20),ymin:maxy-ray,xmax:((maxx>>1)+10),ymax:(maxy+30-ray),n:225,r:true});	

	rebord.push({xmin:((maxx>>1)+10),ymin:(maxy+30-ray),xmax:((maxx>>1)-10),ymax:(maxy+30-ray),n:225,r:false});	
	
	//bas - gauche
	rebord.push({xmin:((maxx>>1)-10),ymin:(maxy+30-ray),xmax:((maxx>>1)-20),ymax:maxy-ray,n:315,r:true});	
	rebord.push({xmin:((maxx>>1)-20),ymin:maxy-ray,xmax:30,ymax:maxy-ray,n:270,r:true});
	rebord.push({xmin:30,ymin:maxy-ray,xmax:0,ymax:(maxy+30-ray),n:225,r:true});	
	
	rebord.push({xmin:0,ymin:(maxy+30-ray),xmax:ray-20,ymax:maxy+5,n:225,r:false});	
	
	//gauche
	rebord.push({xmin:ray-20,ymin:maxy+5,xmax:ray,ymax:(maxy-22),n:45,r:true});	
	rebord.push({xmin:ray,ymin:(maxy-22),xmax:ray,ymax:22,n:0,r:true});
	rebord.push({xmin:ray,ymin:22,xmax:ray-25,ymax:0,n:315,r:true});

	rebord.push({xmin:ray-25,ymin:0,xmax:0,ymax:ray-25,n:225,r:false});	

	
	htm="";
	for (k in rebord)
		{
		p=rebord[k];
		htm=ligne2(p.xmin+minx,p.ymin+miny,p.xmax+minx,p.ymax+miny,2,p.r ?'red':'green');
		p.n= 180-Math.atan2(p.xmax-p.xmin,p.ymax-p.ymin)*rad2deg;
		document.getElementById("body").innerHTML+=htm;
		//alert('normal : '+p.n);
		}
		
	//if (d)
		document.getElementById("body").innerHTML+=htm;

	//efface tempo
	if (tmp!=null)
		{clearTimeout(tmp);}
	
	//lise des boules
	balles = new Array();

	//ajout de la boule blanche
	balles.push(new Balle("b1",155,150,a_v1,v_v1,11,0));
	blanche=balles[0];
	
	//d=false;
	//ajout des boules + disposition en triangle
	n=0;
	for (x=0;x<6;x++)
		for (y=0;y<x;y++)
			{
			if (n!=4)
			balles.push(new Balle("r"+n,400+x*24,200-y*24-(5-x)*11.5,0,0,11,col[n]));		
			n++;
			}

	//affiche les boules a l'ecran
	ajoutBalle();
	
	//associe les evenements
	document.onmousemove=bougerQueue;
}

function getPosition()
{
	delta = !document.all?0:-5;
	//position de l'air du plateau, ok sous IE & firefox
	minx=parseInt(_("ecran").offsetLeft,10)+54+delta;
	maxx=parseInt(_("ecran").offsetWidth,10)-95+delta;

	miny=parseInt(_("ecran").offsetTop,10)+48;
	maxy=parseInt(_("ecran").offsetHeight,10)-98;
	
	//ajuste le div de la queue
	_("ecran2").style.left=minx;
	_("ecran2").style.top=miny;
	_("ecran2").style.width=maxx;
	_("ecran2").style.height=maxy;
	

}

//retourne les proprietes d'un objet (debug)
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
	if (!pause)
		{
		tmp = setTimeout("boucle()",10);
		}
}

//methode la + rapide pr trouver si 2 segements se croisent
function croismt( p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y)
{ 
function delta_killer( p0x, p0y, p1x, p1y, p2x, p2y){ 
 dx1 = p1x - p0x; 
 dy1 = p1y - p0y; 
 dx2 = p2x - p0x; 
 dy2 = p2y - p0y; 
 if( dx1 * dy2 > dy1 * dx2 ) return 1; 
 else if( dx1 * dy2 < dy1 * dx2) return -1; 
 else{ 
      if( dx1 * dx2 < 0 || dy1 * dy2 < 0 ) return -1; 
      else if( dx1 * dx1 + dy1 * dy1 >= dx2 * dx2 + dy2 * dy2 ) return 0; 
      else return 1; 
 } 
}  

return( delta_killer( p1x, p1y, p2x, p2y, p3x, p3y) * delta_killer( p1x, p1y, p2x, p2y, p4x, p4y) <= 0 ) && ( delta_killer( p3x, p3y, p4x, p4y, p1x, p1y) * delta_killer( p3x, p3y, p4x, p4y, p2x, p2y) <= 0 ); 
} 

function testChoc()
{
//test de collision avec un mur
for (e=0;e<balles.length;e++)
	{
	b=balles[e];

	if ((b.nx<b.r)||((b.nx+b.r)>maxx)||(b.ny<b.r)||((b.ny+b.r)>maxy))
	for (k in rebord)
	{
	p=rebord[k];
	if (croismt(b.x,b.y,b.nx,b.ny,p.xmin,p.ymin,p.xmax,p.ymax))
		{
		
		//alert('croisement ['+b.x+' , '+b.y+' - '+b.nx+' ,'+b.ny+' ]  ['+p.xmin+' , '+p.ymin+' - '+p.xmax+' , '+p.ymax+' ]');
		
		z=b.ny ; b.ny=b.y; b.y=z; 
		z=b.nx ; b.nx=b.x; b.x=z; // inversion des positions pour le retour :)
		z=b.a;
		b.a = 2*p.n - b.a + 180;
		
		if (!p.r)
		{
		alert(b.id+" dans le trou !!!");
		}
		//alert(' before = '+z+', n='+p.n+', after = '+b.a);
		/*while(b.a>=360) {b.a-=360;}
		while(b.a<0) {b.a+=360;}*/
		}
	}
	}
//test de choc entre les boules
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

//test de collision
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
	stopper = false;
	for (e=0;e<balles.length;e++)
	{
	b=balles[e];
	//seuil de deplacement avant stop
	if (b.v<seuilStop) 	b.v=0; 
			else b.v-=coefLin;		
	if (b.v>0 && !stopper) 
		stopper = true;
	//b.v*=0.998;
	
		//retourne un angle entre 0 & 360
		while(b.a<0) {b.a+=360;} ;
		while(b.a>=360) {b.a-=360;} ;	
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
	if (d)
		htm+="a :"+parseInt(b.a,10)+" - x :"+parseInt(nx,10)+" - y :"+parseInt(ny,10)+" - v :"+parseInt(b.v*100)/100+"<br>";
	}
	if (!stopper) {
	//alert('stop');
	pause = true;
	}
	//pause = !stopper;
//if (d) 
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
htm+="<img id='"+b.id+"' src='img/"+src[b.t]+".png' style='position:absolute; top:"+(b.y-b.r+miny)+"px;left:"+(b.x-b.r+minx)+"px;width:"+(b.r*2-1)+"px;height:"+(b.r*2-1)+"px;'>";
}
_("ecran").innerHTML = htm;
}

//-------------------------------------
//-------------------------------------

function ajoutPix(x, y, l, h, c)
{
	return "<div style='left:"+x+"px;top:"+y+"px;width:"+l+"px;height:"+h+"px;background-color:"+c+";overflow:hidden;position:absolute;'><\/div>";
}

/*
tracer d'une droite avec l'algorithme Bresenham
-modifié pour créer un effet d'epaisseur 
x1,y1,x2,y2 : coordonnée du segment
diam : diametre du segment
c : couleur
*/

function ligne2(x1, y1, x2, y2, diam, c)
{
htm="";
if (c==null) 
	c="black"; //couleur par defaut
if (diam==null) 
	diam=2; //epaiseur par defaut	
	if(x1 > x2)
	{
	//swap(x1,x2);
		var z = x2;x2 = x1;x1 = z;
		z = y2;y2 = y1;y1 = z;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1); //delta x & y
	var x = x1, y = y1;
	var ySens = (y1 > y2)? -1 : 1; //direction de Y
	
	if(dx < dy)
		{
		var d2 = diam>>1; //equivalent à Math.round(diam/2);

		var dxy = 2*(dx - dy),
		p = 2*dx-dy,
		py = y;
		
		if(y2 > y1)
		{
			while(dy > 0)
			{   --dy;
				y += ySens;
				if(p > 0)
				{
					htm+=ajoutPix(x++, py, diam, y-py+d2,c);
					p += dxy;
					py = y;
				}
				else p += 2*dx;
			}
			htm+=ajoutPix(x2, py, diam, y2-py+d2+1,c);
		}
		else
		{
			while(dy > 0)
			{--dy;
				if(p > 0)
				{
					htm+=ajoutPix(x++, y, diam, py-y+d2,c);
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
			htm+=ajoutPix(x2, y2, diam, py-y2+d2,c);
		}
	}
	else
	{
		var dxy = 2*(dy - dx),
		p = 2*dy-dx,
		px = x;
		d2 = diam>>1 ;
		
		while(dx > 0)
		{--dx;
			++x;
			if(p > 0)
			{
				htm+=ajoutPix(px, y, x-px+d2, diam,c);
				y += ySens;
				p += dxy;
				px = x;
			}
			else p += 2*dy;
		}
		htm+=ajoutPix(px, y, x2-px+d2+1, diam,c);
	}
	return htm;
}