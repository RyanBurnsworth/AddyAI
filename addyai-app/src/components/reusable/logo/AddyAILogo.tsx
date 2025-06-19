import React from 'react';
import './addyAiLogo.css';

interface AddyAILogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

const AddyAILogo: React.FC<AddyAILogoProps> = ({ size = 'large', className = '' }) => {
  const sizeClasses: Record<string, string> = {
    small: 'w-64 h-52',
    medium: 'w-80 h-64',
    large: 'w-[500px] h-96',
    xlarge: 'w-[600px] h-[480px]',
  };

  const textSizes: Record<string, string> = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-5xl',
    xlarge: 'text-6xl',
  };

  return (
    <div className={`addyai-logo-container ${sizeClasses[size]} ${className}`}>
      {/* Glow Background */}
      <div className="glow-background" />

      {/* Outer Rotating Rings */}
      <div className="rotating-ring ring-1" />
      <div className="rotating-ring ring-2" />
      <div className="rotating-ring ring-3" />

      {/* Neural Network Nodes */}
      <div className="neural-node node-1" />
      <div className="neural-node node-2" />
      <div className="neural-node node-3" />
      <div className="neural-node node-4" />

      {/* Neural Network Connections */}
      <div className="neural-connection connection-1" />
      <div className="neural-connection connection-2" />

      {/* Brain Wave Patterns */}
      <div className="brain-wave wave-1" />
      <div className="brain-wave wave-2" />

      {/* Central AI Core */}
      <div className="ai-core" />

      {/* Orbiting Data Particles */}
      <div className="orbit-particle particle-1" />
      <div className="orbit-particle particle-2" />
      <div className="orbit-particle particle-3" />
      <div className="orbit-particle particle-4" />
      <div className="orbit-particle particle-5" />

      {/* Floating Ad Metrics */}
      <div className="floating-metric metric-1">CPC</div>
      <div className="floating-metric metric-2">CTR</div>
      <div className="floating-metric metric-3">ROAS</div>
      <div className="floating-metric metric-4">CVR</div>

      {/* Brand Text */}
      <div className={`brand-text ${textSizes[size]}`}>
        Addy
        <span className="ai-text">AI</span>
      </div>
    </div>
  );
};

export default AddyAILogo;
