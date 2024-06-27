var selected="With Out Hidden Surface";
const points = [];
const points3d=function(x,y,z){
    this.x=x;
    this.y=y;
    this.z=z;
}
const normalvector=[]



document.addEventListener('DOMContentLoaded', function() {
    handleCanvasSize();
    console.log(points);
    drawCube();
    listen();
   
    
});


// handle canvas size
function handleCanvasSize(){
    let canvas = document.getElementById('canvas');
    let height=document.documentElement.clientHeight;
    let width=document.documentElement.clientWidth;
   
    canvas.width = width;
    canvas.height = height;

    let x=canvas.width/2;
    console.log("x:",x);
    let y=canvas.height/2;
    console.log("y:",y);
    let z=0;
    var size= height/4;
    console.log("size:",size);
  
    points.push(new points3d(x-size,y-size,z-size));//0
    points.push(new points3d(x+size,y-size,z-size));//1
    points.push(new points3d(x+size,y+size,z-size));//2
    points.push(new points3d(x-size,y+size,z-size));//3
    points.push(new points3d(x-size,y-size,z+size));//4
    points.push(new points3d(x+size-90,y-size,z+size));//5- sperate to 3 point cut it corner of cube   
    points.push(new points3d(x+size,y-size+90,z+size));//6- sperate to 3 point cut it corner of cube  
    points.push(new points3d(x+size,y-size,z+size-90));//7- sperate to 3 point cut it corner of cube 
    points.push(new points3d(x+size,y+size,z+size));//8
    points.push(new points3d(x-size,y+size,z+size));//9
      

}
function drawCube(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    var edges=[
        [0,1],[1,2],[2,3],[3,0],//backsurface 
        [4,5],[5,7],[7,6],[6,5],[6,8],[8,9],[9,4],//frontsurface with cutted corner
        [0,4],[1,7],[2,8],[3,9]  //connectors
    ]
    const plane=[[[1,7],[7,5],[5,4],[4,0],[0,1]],
                [[1,2],[2,3],[3,0],[0,1]],
                [[0,3],[3,9],[9,4],[4,0]],
                [[1,2],[2,8],[8,6],[6,7],[7,1]],
                [[4,5],[5,6],[6,8],[8,9],[9,4]],
                [[2,3],[3,9],[9,8],[8,2]],
                [[5,6],[6,7],[7,5]]];//plane0,plane1,plane2,plane3,plane4,plane5,plane6,
    

    console.log("points:",points);
    
    if (selected == "With Out Hidden Surface") {
        console.log("With Out Hidden Surface");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let edge of edges){
            ctx.beginPath();     
            ctx.moveTo(points[edge[0]].x,points[edge[0]].y);
            ctx.lineTo(points[edge[1]].x,points[edge[1]].y);
            ctx.stroke();

        }
        ctx.closePath();
        number_corner();
        number_face();
        
    }
    if (selected == "Backface Culling") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Backface Culling");
        normal_vector_plane()
        var forrontface=isFrontFace()
        for(let i =0 ;i<forrontface.length;i++){
            if(forrontface[i]==true ){
                for(let edge of plane[i]){
                    ctx.beginPath();     
                    ctx.moveTo(points[edge[0]].x,points[edge[0]].y);
                    ctx.lineTo(points[edge[1]].x,points[edge[1]].y);
                    ctx.stroke();
                }
                ctx.closePath();
            }
        }
    }
    if(selected=="Painting Algorithm"){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Painting Algorithm");
        var planeZIndex={"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0};
        var jsonArray=calculationAvrageZ(planeZIndex); //give the array of plane with increasing order of Z index

        for (let i = 0; i < jsonArray.length; i++) { // here select the plane with the lowest Z index and make each points of plane draw it according to increasing order of Z index
            ctx.beginPath();
            ctx.moveTo(points[plane[jsonArray[i][0]][0][0]].x,points[plane[jsonArray[i][0]][0][0]].y);
            ctx.lineTo(points[plane[jsonArray[i][0]][0][1]].x,points[plane[jsonArray[i][0]][0][1]].y);
            for(var j=1;j<plane[jsonArray[i][0]].length;j++){                     
                ctx.lineTo(points[plane[jsonArray[i][0]][j][0]].x,points[plane[jsonArray[i][0]][j][0]].y);
                ctx.lineTo(points[plane[jsonArray[i][0]][j][1]].x,points[plane[jsonArray[i][0]][j][1]].y);
                ctx.stroke();
            }
            ctx.fillStyle="white";// when each plane is drawed , fill it with white color to make it look like a cube erase the backward plane
            ctx.fill();
            ctx.closePath();
        }       
          
    }
    if(selected=="Z-Buffer Algorithm"){
        zBuffer=[];
        for(let i=0;i<canvas.width;i++){
            zBuffer[i]=[];
            for(let j=0;j<canvas.height;j++){
                zBuffer[i][j]=[Infinity,"white"];
            }
        }
        
    }
}

// listen all keydown event
function listen(){
    document.addEventListener('keydown', function(event) {
        console.log(event.keyCode);
        if(event.keyCode==37){
            rotateZaxis(-0.01);
            console.log("left");
        }
        if(event.keyCode==39){
            rotateZaxis(0.01);
            console.log("right");
        }
        if(event.keyCode==38){
            rotateYaxis(-0.01);
            console.log("up");
        }
        if(event.keyCode==40){
            rotateYaxis(0.01);
            console.log("down");
        }
        if(event.keyCode==104){
            rotateXaxis(0.01);
            console.log("8");
        }
        if(event.keyCode==98){
            rotateXaxis(-0.01);
            console.log("2");
        }
        if(event.keyCode==87){
            translationYaxis(-10);
            console.log("w");
        }
        if(event.keyCode==83){
            translationYaxis(10);
            console.log("s");
        }
        if(event.keyCode==65){
            translationXaxis(-10);
            console.log("a");
        }
        if(event.keyCode==68){
            translationXaxis(10);
            console.log("d");
        }
        if(event.keyCode==107){
            scaleUp();
            console.log("+");
        }
        if(event.keyCode==109){
            scaleDown();
            console.log("-");
        }
    })
}

//rotate function With Z axis
function rotateZaxis(angle){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    for(let point of points){
      
        let dx= point.x-canvas.width/2;
        let dy= point.y-canvas.height/2;

        let x=dx*Math.cos(angle)-dy*Math.sin(angle);
        let y=dx*Math.sin(angle)+dy*Math.cos(angle);
        point.x=x+canvas.width/2;
        point.y=y+canvas.height/2;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCube();
}
//rotate function With Y axis
function rotateYaxis(angle){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    for(let point of points){
      
        let dx= point.x-canvas.width/2;
        let dz= point.z-0;

        let x=dx*Math.cos(angle)+dz*Math.sin(angle);
        let z=-dx*Math.sin(angle)+dz*Math.cos(angle);

        point.x=x+canvas.width/2;
        point.z=z+0;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCube();
}
//rotate function With X axis
function rotateXaxis(angle){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    for(let point of points){
      
        let dy= point.y-canvas.height/2;
        let dz= point.z-0;

        let y=dy*Math.cos(angle)-dz*Math.sin(angle);
        let z=dy*Math.sin(angle)+dz*Math.cos(angle);

        point.y=y+canvas.height/2;
        point.z=z+0;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCube();
}

//translation function With X axis
function translationXaxis(dx){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    for(let point of points){
        point.x+=dx;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCube();
}
//translation function With Y axis
function translationYaxis(dy){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    for(let point of points){
        point.y+=dy;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCube();
}
//scale Up function 
function scaleUp(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    for(let point of points){
        point.x*=1.005;
        point.y*=1.005;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCube();
}
// scale Down function
function scaleDown(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    for(let point of points){
        point.x/=1.005;
        point.y/=1.005;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCube();
}

function number_corner(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle="green";
    ctx.fillText("0",points[0].x+5,points[0].y+5);
    ctx.fillText("1",points[1].x+5,points[1].y+5);
    ctx.fillText("2",points[2].x+5,points[2].y+5);
    ctx.fillText("3",points[3].x+5,points[3].y+5);
    ctx.fillText("4",points[4].x+5,points[4].y+5);
    ctx.fillText("5",points[5].x+5,points[5].y+5);
    ctx.fillText("6",points[6].x+5,points[6].y+5);
    ctx.fillText("7",points[7].x+5,points[7].y+5);
    ctx.fillText("8",points[8].x+5,points[8].y+5);
    ctx.fillText("9",points[9].x+5,points[9].y+5);
}

function number_face(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillText("0 plane",Math.abs(points[1].x-points[4].x)/2+Math.min(points[1].x,points[4].x) ,Math.abs(points[1].y-points[4].y)/2+Math.min(points[1].y,points[4].y));
    ctx.fillText("1 plane",Math.abs(points[1].x-points[3].x)/2+Math.min(points[1].x,points[3].x) ,Math.abs(points[1].y-points[3].y)/2+Math.min(points[1].y,points[3].y));
    ctx.fillText("2 plane",Math.abs(points[0].x-points[9].x)/2+Math.min(points[0].x,points[9].x) ,Math.abs(points[0].y-points[9].y)/2+Math.min(points[0].y,points[9].y));
    ctx.fillText("3 plane",Math.abs(points[1].x-points[8].x)/2+Math.min(points[1].x,points[8].x) ,Math.abs(points[1].y-points[8].y)/2+Math.min(points[1].y,points[8].y));
    ctx.fillText("4 plane",Math.abs(points[4].x-points[8].x)/2+Math.min(points[4].x,points[8].x) ,Math.abs(points[4].y-points[8].y)/2+Math.min(points[4].y,points[8].y));
    ctx.fillText("5 plane",Math.abs(points[2].x-points[9].x)/2+Math.min(points[2].x,points[9].x) ,Math.abs(points[2].y-points[9].y)/2+Math.min(points[2].y,points[9].y));
    ctx.fillText("6 plane",Math.abs(points[5].x-points[7].x)/2+Math.min(points[5].x,points[7].x) ,Math.abs(points[5].y-points[6].y)/2+Math.min(points[5].y,points[6].y));

}
function normal_vector_plane(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    //0 plane
    var r1=[points[0].x-points[4].x,points[0].y-points[4].y,points[0].z-points[4].z];
    var r2=[points[0].x-points[1].x,points[0].y-points[1].y,points[0].z-points[1].z];
    normalvector[0]=(crossProduct(r1,r2));
    //1 plane
    r1=[points[1].x-points[2].x,points[1].y-points[2].y,points[1].z-points[2].z];
    r2=    [points[1].x-points[0].x,points[1].y-points[0].y,points[1].z-points[0].z];
    normalvector[1]=(crossProduct(r1,r2));
    //2 plane
    r1=[points[3].x-points[9].x,points[3].y-points[9].y,points[3].z-points[9].z];
    r2=[points[3].x-points[0].x,points[3].y-points[0].y,points[3].z-points[0].z];
    normalvector[2]=(crossProduct(r1,r2));
    //3 plane
    r1=[points[2].x-points[1].x,points[2].y-points[1].y,points[2].z-points[1].z];
    r2=[points[2].x-points[8].x,points[2].y-points[8].y,points[2].z-points[8].z];
    normalvector[3]=(crossProduct(r1,r2));
    //4 plane
    r1=[points[9].x-points[8].x,points[9].y-points[8].y,points[9].z-points[8].z];
    r2=[points[9].x-points[4].x,points[9].y-points[4].y,points[9].z-points[4].z];
    normalvector[4]=(crossProduct(r1,r2));
    //5 plane
    r1=[points[9].x-points[3].x,points[9].y-points[3].y,points[9].z-points[3].z];
    r2=[points[9].x-points[8].x,points[9].y-points[8].y,points[9].z-points[8].z];
    normalvector[5]=(crossProduct(r1,r2));
    //6 plane
    r1=[points[5].x-points[6].x,points[5].y-points[6].y,points[5].z-points[6].z];
    r2= [points[5].x-points[7].x,points[5].y-points[7].y,points[5].z-points[7].z];
    normalvector[6]=(crossProduct(r1,r2));
    console.log("normalvector:",normalvector);
}

function crossProduct(a,b){
    var c=[];

    c[0]=a[1]*b[2]-a[2]*b[1];
    c[1]=a[2]*b[0]-a[0]*b[2];
    c[2]=a[0]*b[1]-a[1]*b[0];
    var length=Math.sqrt(Math.pow(c[0],2)+Math.pow(c[1],2)+Math.pow(c[2],2));
    console.log("length:",length);
    c[0]=c[0]/length;
    c[1]=c[1]/length;
    c[2]=c[2]/length;
    return c;
  

}

function isFrontFace(){
    var result=[];
    var view_vector=[0,0,-1]
    for(let i=0;i<normalvector.length;i++){
        var a=normalvector[i][0]*view_vector[0]+normalvector[i][1]*view_vector[1]+normalvector[i][2]*view_vector[2];
        if(a>0){
            result[i]=true;
        }
        else{
            result[i]=false;
        }
    }
    console.log("result:",result);
    return result;
}

function calculationAvrageZ(planeZIndex){
    
        //calculate avarage Z index of each plane     
        planeZIndex[0]=(points[4].z+points[5].z+points[6].z+(points[7].z+90))/4;
        planeZIndex[1]=(points[1].z+points[0].z+points[3].z+points[2].z)/4;
        planeZIndex[2]=(points[0].z+points[3].z+points[9].z+points[4].z)/4;
        planeZIndex[3]=(points[1].z+points[2].z+points[8].z+(points[7].z+90))/4;
        planeZIndex[4]=(points[4].z+points[9].z+points[8].z+points[5].z)/4;
        planeZIndex[5]=(points[3].z+points[9].z+points[8].z+points[2].z)/4;
        planeZIndex[6]=(points[5].z+points[6].z+points[7].z)/3;
        console.log("planeZIndex:",planeZIndex);
        var jsonArray = Object.entries(planeZIndex);
        
        jsonArray.sort(function(a, b) {
            return a[1]-b[1] ;
          });
        return jsonArray;
}

function handleClick(value){
    selected=value;
    document.getElementById("selected").innerHTML = `Selected:${value}`;
    drawCube();
    
}

