import React from 'react';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function MotherBabyIllustration({ size = 180 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <G>
        {/* Mother's hair - flowing brown hair */}
        <Path
          d="M100 30 C60 30 45 60 45 90 C45 105 50 120 55 130 L55 125 C50 110 48 95 50 80 C55 55 75 40 100 40 C125 40 145 55 150 80 C152 95 150 110 145 125 L145 130 C150 120 155 105 155 90 C155 60 140 30 100 30 Z"
          fill="#9B5941"
        />
        {/* Hair wave on right side */}
        <Path
          d="M145 70 C150 85 155 100 150 120 C148 130 145 140 140 145 L142 140 C147 130 150 115 148 100 C146 85 143 75 145 70 Z"
          fill="#8B4931"
        />
        
        {/* Mother's face */}
        <Ellipse cx="100" cy="70" rx="35" ry="38" fill="#F5D2C2" />
        
        {/* Mother's closed eye - left */}
        <Path
          d="M85 65 Q90 63 95 65"
          stroke="#2C3E50"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Eyelashes */}
        <Path
          d="M83 66 L81 63 M87 64 L85 60 M91 63 L90 59"
          stroke="#2C3E50"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Mother's closed eye - right */}
        <Path
          d="M105 65 Q110 63 115 65"
          stroke="#2C3E50"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Eyelashes */}
        <Path
          d="M107 63 L106 59 M111 64 L111 60 M115 66 L117 63"
          stroke="#2C3E50"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Mother's gentle smile */}
        <Path
          d="M93 82 Q100 88 107 82"
          stroke="#D4A99A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Mother's body/clothing - teal top */}
        <Path
          d="M60 105 C60 95 75 90 100 90 C125 90 140 95 140 105 L145 160 C145 170 130 175 100 175 C70 175 55 170 55 160 L60 105 Z"
          fill="#7AB5A5"
        />
        
        {/* Neckline detail */}
        <Path
          d="M80 95 Q100 105 120 95"
          stroke="#6AA595"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Mother's left arm (holding baby) */}
        <Path
          d="M60 115 C50 120 45 140 50 155 C52 160 55 162 60 160 L65 135 C67 125 65 118 60 115 Z"
          fill="#F5D2C2"
        />
        
        {/* Mother's right arm */}
        <Path
          d="M140 115 C150 120 155 140 150 155 C148 160 145 162 140 160 L135 135 C133 125 135 118 140 115 Z"
          fill="#F5D2C2"
        />
        
        {/* Baby's head */}
        <Ellipse cx="90" cy="125" rx="18" ry="16" fill="#F5D2C2" />
        
        {/* Baby's ear */}
        <Ellipse cx="75" cy="125" rx="4" ry="5" fill="#F0C8B8" />
        
        {/* Baby's closed eye */}
        <Path
          d="M85 123 Q88 121 91 123"
          stroke="#2C3E50"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Baby's peaceful expression */}
        <Path
          d="M86 130 Q89 132 92 130"
          stroke="#D4A99A"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Baby's body wrapped in blanket */}
        <Path
          d="M75 135 C70 140 68 155 75 165 C85 175 115 175 125 165 C130 155 128 145 120 138 C110 130 85 130 75 135 Z"
          fill="#8CC4B5"
        />
        
        {/* Baby blanket fold detail */}
        <Path
          d="M80 140 Q95 145 110 140"
          stroke="#7AB5A5"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Small decorative hearts */}
        <Path
          d="M155 50 C155 47 158 45 160 47 C162 45 165 47 165 50 C165 54 160 58 160 58 C160 58 155 54 155 50 Z"
          fill="#FEEBF7"
        />
        <Path
          d="M40 80 C40 78 42 76 44 77 C46 76 48 78 48 80 C48 83 44 86 44 86 C44 86 40 83 40 80 Z"
          fill="#FEEBF7"
        />
      </G>
    </Svg>
  );
}
