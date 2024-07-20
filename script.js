document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    const uiContainer = document.createElement('div');
    uiContainer.id = 'ui-container';
    document.body.appendChild(uiContainer);

    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    uiContainer.appendChild(scoreElement);

    const levelElement = document.createElement('div');
    levelElement.id = 'level';
    uiContainer.appendChild(levelElement);

    const messageElement = document.createElement('div');
    messageElement.id = 'message';
    uiContainer.appendChild(messageElement);

    const style = document.createElement('style');
    style.textContent = `
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
        #ui-container { position: absolute; top: 10px; left: 10px; color: white; font-family: Arial, sans-serif; }
        #score, #level { font-size: 18px; margin-bottom: 5px; }
        #message { font-size: 24px; font-weight: bold; margin-top: 20px; }
    `;
    document.head.appendChild(style);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    let score = 0;
    let level = 1;
    let puzzleCubes = [];
    let selectedCube = null;
    const mainCube = createMainCube();
    scene.add(mainCube);

    camera.position.z = 5;

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const particles = createParticles();
    scene.add(particles);

    initGame();

    function animate() {
        requestAnimationFrame(animate);

        mainCube.rotation.x += 0.005;
        mainCube.rotation.y += 0.005;

        puzzleCubes.forEach(cube => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        });

        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.01;
            if (positions[i + 1] < -5) positions[i + 1] = 5;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();

    function initGame() {
        createPuzzleCubes();
        updateUI();
    }

    function createMainCube() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const materials = [
            new THREE.MeshPhongMaterial({color: 0xff0000}),
            new THREE.MeshPhongMaterial({color: 0x00ff00}),
            new THREE.MeshPhongMaterial({color: 0x0000ff}),
            new THREE.MeshPhongMaterial({color: 0xffff00}),
            new THREE.MeshPhongMaterial({color: 0xff00ff}),
            new THREE.MeshPhongMaterial({color: 0x00ffff})
        ];
        return new THREE.Mesh(geometry, materials);
    }

    function createPuzzleCubes() {
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const material = new THREE.MeshPhongMaterial({color: 0xffffff});
            const puzzleCube = new THREE.Mesh(geometry, material);
            puzzleCube.position.set(
                Math.random() * 4 - 2,
                Math.random() * 4 - 2,
                Math.random() * 4 - 2
            );
            puzzleCubes.push(puzzleCube);
            scene.add(puzzleCube);
        }
    }

    function createParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 5000; i++) {
            vertices.push(
                Math.random() * 10 - 5,
                Math.random() * 10 - 5,
                Math.random() * 10 - 5
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({color: 0xffffff, size: 0.05});
        return new THREE.Points(geometry, material);
    }

    function updateUI() {
        scoreElement.textContent = `Score: ${score}`;
        levelElement.textContent = `Level: ${level}`;
    }

    function checkPuzzleSolved() {
        const tolerance = 0.1 * (1 / level);
        return puzzleCubes.every(cube => 
            Math.abs(cube.position.x) < tolerance &&
            Math.abs(cube.position.y) < tolerance &&
            Math.abs(cube.position.z) < tolerance
        );
    }

    function handlePuzzleSolved() {
        score += level * 100;
        level++;
        messageElement.textContent = `Level ${level - 1} Complete!`;
        setTimeout(() => {
            messageElement.textContent = '';
            scene.remove(...puzzleCubes);
            puzzleCubes = [];
            createPuzzleCubes();
        }, 2000);
        updateUI();
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);

    function onMouseDown(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(puzzleCubes);
        if (intersects.length > 0) {
            selectedCube = intersects[0].object;
        }
    }

    function onMouseUp() {
        selectedCube = null;
        if (checkPuzzleSolved()) {
            handlePuzzleSolved();
        }
    }

    function onMouseMove(event) {
        if (selectedCube) {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(mainCube);
            if (intersects.length > 0) {
                selectedCube.position.copy(intersects[0].point);
            }
        }
    }
});
