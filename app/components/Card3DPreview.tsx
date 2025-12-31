'use client'

import { useEffect, useRef, useState } from 'react'
import type { Texture } from 'three'

interface Card3DPreviewProps {
  imageUrl: string
  onClose: () => void
}

export function Card3DPreview({ imageUrl, onClose }: Card3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return
    isInitialized.current = true

    let animationId: number
    let cleanup: (() => void) | undefined

    const initScene = async () => {
      // Dynamic import Three.js
      const THREE = await import('three')
      const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')

      const container = containerRef.current!
      
      // Clear any existing canvas elements
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      
      const width = container.clientWidth
      const height = container.clientHeight

      // Scene setup with deep midnight blue
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x0a0e1a)

      // Camera positioned closer for bigger card
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
      camera.position.set(0, 0.3, 2.8)

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      container.appendChild(renderer.domElement)

      // Orbit controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.minDistance = 1.5
      controls.maxDistance = 6
      controls.maxPolarAngle = Math.PI * 0.85
      controls.target.set(0, 0, 0) // Center the controls on the card

      // Midnight celebration lighting with champagne gold and electric blue accents
      const ambientLight = new THREE.AmbientLight(0xf7e7ce, 0.5)
      scene.add(ambientLight)

      const mainLight = new THREE.DirectionalLight(0xfffaf0, 1.2)
      mainLight.position.set(3, 5, 4)
      mainLight.castShadow = true
      mainLight.shadow.mapSize.width = 2048
      mainLight.shadow.mapSize.height = 2048
      scene.add(mainLight)

      // Champagne gold fill light
      const fillLight = new THREE.DirectionalLight(0xd4af37, 0.4)
      fillLight.position.set(-3, 2, -2)
      scene.add(fillLight)

      // Electric blue rim light for dramatic effect
      const rimLight = new THREE.DirectionalLight(0x4169e1, 0.3)
      rimLight.position.set(0, -2, -3)
      scene.add(rimLight)

      // Load the card texture
      const textureLoader = new THREE.TextureLoader()
      const cardTexture = await new Promise<Texture>((resolve) => {
        textureLoader.load(imageUrl, (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace
          resolve(texture)
        })
      })

      // Card dimensions (bigger greeting card proportions)
      const cardWidth = 2.4
      const cardHeight = 1.8
      const panelWidth = cardWidth / 2

      // Create card group (pivot at the fold line) - centered at origin
      const cardGroup = new THREE.Group()
      cardGroup.position.set(0, 0, 0)
      scene.add(cardGroup)

      // Paper material (elegant champagne colored back)
      const paperBackMaterial = new THREE.MeshStandardMaterial({
        color: 0xf7e7ce,
        roughness: 0.7,
        metalness: 0.05,
        side: THREE.BackSide,
      })

      // Left panel (stationary) - shows left half of image
      const leftPanelGeometry = new THREE.PlaneGeometry(panelWidth, cardHeight)

      // UV mapping for left panel - use left half of texture (0 to 0.5)
      const leftUVs = leftPanelGeometry.attributes.uv
      for (let i = 0; i < leftUVs.count; i++) {
        const u = leftUVs.getX(i)
        leftUVs.setX(i, u * 0.5) // Map 0-1 to 0-0.5
      }
      leftUVs.needsUpdate = true

      const leftPanelMaterial = new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.FrontSide,
      })

      const leftPanel = new THREE.Mesh(leftPanelGeometry, leftPanelMaterial)
      leftPanel.position.x = -panelWidth / 2
      leftPanel.castShadow = true
      leftPanel.receiveShadow = true
      cardGroup.add(leftPanel)

      // Left panel back
      const leftPanelBack = new THREE.Mesh(
        new THREE.PlaneGeometry(panelWidth, cardHeight),
        paperBackMaterial
      )
      leftPanelBack.position.x = -panelWidth / 2
      leftPanelBack.position.z = -0.002
      cardGroup.add(leftPanelBack)

      // Right panel group (this will rotate for the fold animation)
      const rightPanelGroup = new THREE.Group()
      rightPanelGroup.position.x = 0 // Pivot at center fold
      cardGroup.add(rightPanelGroup)

      // Right panel - shows right half of image
      const rightPanelGeometry = new THREE.PlaneGeometry(panelWidth, cardHeight)

      // UV mapping for right panel - use right half of texture (0.5 to 1.0)
      const rightUVs = rightPanelGeometry.attributes.uv
      for (let i = 0; i < rightUVs.count; i++) {
        const u = rightUVs.getX(i)
        rightUVs.setX(i, 0.5 + u * 0.5) // Map 0-1 to 0.5-1.0
      }
      rightUVs.needsUpdate = true

      const rightPanelMaterial = new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.FrontSide,
      })

      const rightPanel = new THREE.Mesh(rightPanelGeometry, rightPanelMaterial)
      rightPanel.position.x = panelWidth / 2
      rightPanel.castShadow = true
      rightPanel.receiveShadow = true
      rightPanelGroup.add(rightPanel)

      // Right panel back
      const rightPanelBack = new THREE.Mesh(
        new THREE.PlaneGeometry(panelWidth, cardHeight),
        paperBackMaterial.clone()
      )
      rightPanelBack.material.side = THREE.FrontSide
      rightPanelBack.position.x = panelWidth / 2
      rightPanelBack.position.z = -0.002
      rightPanelBack.rotation.y = Math.PI
      rightPanelGroup.add(rightPanelBack)

      // Floor/surface for shadow
      const floorGeometry = new THREE.PlaneGeometry(10, 10)
      const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -Math.PI / 2
      floor.position.y = -cardHeight / 2 - 0.01
      floor.receiveShadow = true
      scene.add(floor)

      // Add celebration sparkles - mix of gold, champagne, and blue
      const particleCount = 80
      const particleGeometry = new THREE.BufferGeometry()
      const particlePositions = new Float32Array(particleCount * 3)
      const particleColors = new Float32Array(particleCount * 3)

      const sparkleColors = [
        new THREE.Color(0xd4af37), // Gold
        new THREE.Color(0xf7e7ce), // Champagne
        new THREE.Color(0x4169e1), // Electric blue
        new THREE.Color(0xffd700), // Bright gold
        new THREE.Color(0xc0c0c0), // Silver
      ]

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 6
        particlePositions[i * 3 + 1] = Math.random() * 3 - 0.5
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6

        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
        particleColors[i * 3] = color.r
        particleColors[i * 3 + 1] = color.g
        particleColors[i * 3 + 2] = color.b
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.04,
        transparent: true,
        opacity: 0.85,
        vertexColors: true,
      })
      const particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)

      // Animation state
      let foldAngle = Math.PI * 0.95 // Start nearly closed
      const targetAngle = Math.PI * 0.2 // HOW MUCH FOLDED IT IS
      const animationSpeed = 0.02
      let animationComplete = false

      setIsLoading(false)

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate)

        // Animate card opening
        if (!animationComplete) {
          foldAngle = THREE.MathUtils.lerp(foldAngle, targetAngle, animationSpeed)
          rightPanelGroup.rotation.y = -foldAngle

          if (Math.abs(foldAngle - targetAngle) < 0.01) {
            animationComplete = true
            rightPanelGroup.rotation.y = -targetAngle
          }
        }

        // Subtle floating animation for particles
        const positions = particleGeometry.attributes.position.array as Float32Array
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.0005
        }
        particleGeometry.attributes.position.needsUpdate = true

        // Gentle card rotation
        cardGroup.rotation.y = Math.sin(Date.now() * 0.0003) * 0.05

        controls.update()
        renderer.render(scene, camera)
      }

      animate()

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return
        const w = containerRef.current.clientWidth
        const h = containerRef.current.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }

      window.addEventListener('resize', handleResize)

      // Cleanup function
      cleanup = () => {
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
        renderer.dispose()
        controls.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
        isInitialized.current = false
      }
    }

    initScene()

    return () => {
      if (cleanup) cleanup()
    }
  }, [imageUrl])

  return (
    <div className="card-3d-overlay">
      <div className="card-3d-modal">
        {/* Close button */}
        <button onClick={onClose} className="card-3d-close">
          ✕
        </button>

        {/* Title */}
        <h2 className="card-3d-title">3D Card Preview</h2>
        <p className="card-3d-subtitle">Drag to rotate • Scroll to zoom</p>

        {/* Loading indicator */}
        {isLoading && (
          <div className="card-3d-loading">
            <div className="spinner"></div>
            <span>Loading 3D preview...</span>
          </div>
        )}

        {/* Three.js container */}
        <div ref={containerRef} className="card-3d-container" />
      </div>
    </div>
  )
}