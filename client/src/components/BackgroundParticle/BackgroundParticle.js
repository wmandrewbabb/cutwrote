import React, { Component } from "react";
import "./BackgroundParticle.css";
import THREE from "three";


//IT IS IMPORTANT TO NOTE THAT NONE OF THIS WORKS SO IT'S NOT IN THE FINAL APP CURRENTLY
//Trying to adapt this from a nifty codepen https://codepen.io/anon/pen/BqQOvd?editors=1000
class BackgroundParticle extends Component {

  constructor() {
    this.state = {
      camera,
      scene,
      renderer, 
      particles,
      particle,
      material,
      particleCount,
      points, 
      texture,
      xSpeed = 0.0005,
      ySpeed = 0.001,
      winWidth = window.innerWidth,
      winHeight = window.innerHeight,
    }
  }

  componentDidMount() {

    init();
    animate();
  
  };
  
  init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#222", 0.001);
  
    camera = new THREE.PerspectiveCamera(75, winWidth / winHeight, 1, 1000);
    camera.position.z = 500;
  
    // particle
    // transparentとblendingたぶん効いてない
    material = new THREE.PointsMaterial({
      color: 0x000000,
      size: 3,
      transparent: false,
      blending: THREE.AdditiveBlending
    });
  
    particleCount = 500;
    particles = new THREE.Geometry();
  
    for (var i = 0; i < particleCount; i++) {
      var px = Math.random() * 1000 - 500;
      var py = Math.random() * 1000 - 500;
      var pz = Math.random() * 1000 - 500;
      particle = new THREE.Vector3(px, py, pz);
      particle.velocity = new THREE.Vector3(0, Math.random(), 0);
      particles.vertices.push(particle);
    }
  
    points = new THREE.Points(particles, material);
    points.sortParticles = true;
    scene.add(points);
  
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(winWidth, winHeight);
    renderer.setClearColor("#fff", 1);
    document.getElementById("canvas").appendChild(renderer.domElement);
  }
  
  animate() {
    requestAnimationFrame(animate);
  
    scene.rotation.y += xSpeed;
  
    // パーティクル上下移動
    var i = particleCount;
    while (i--) {
      var particle = particles.vertices[i];
  
      // y
      if (particle.y > 1000) {
        particle.y = -1000;
        particle.velocity.y = Math.random();
      }
      particle.velocity.y += Math.random() * ySpeed;
  
      particle.add(particle.velocity);
    }
    points.geometry.verticesNeedUpdate = true;
  
    render();
  }
  
  render() {
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  
  render(){
    return(
    <div class="backgroundParticle" id="canvas">
    </div>
  );

  };
}

export default BackgroundParticle;
