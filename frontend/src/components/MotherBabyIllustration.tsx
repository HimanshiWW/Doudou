import React from 'react';
import Svg, { Path, Circle, Ellipse, G, Defs, ClipPath } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function MotherBabyIllustration({ size = 200 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="circleClip">
          <Circle cx="100" cy="100" r="98" />
        </ClipPath>
      </Defs>
      
      <G clipPath="url(#circleClip)">
        {/* Background - soft pink */}
        <Circle cx="100" cy="100" r="100" fill="#FEEBF7" />
        
        {/* === MOTHER'S HAIR - BACK LAYER === */}
        {/* Hair flowing on left side */}
        <Path
          d="M45 60 
             C38 80, 35 110, 40 145
             C42 160, 45 175, 50 190
             L58 190
             C53 175, 50 160, 48 145
             C44 115, 46 85, 52 65
             Z"
          fill="#8B5A3C"
        />
        
        {/* Hair flowing on right side */}
        <Path
          d="M145 55
             C155 75, 158 100, 155 135
             C153 155, 148 175, 145 190
             L137 190
             C140 175, 144 155, 146 135
             C149 105, 147 80, 140 62
             Z"
          fill="#8B5A3C"
        />
        
        {/* === MOTHER'S FACE === */}
        <Ellipse cx="96" cy="62" rx="38" ry="40" fill="#F5D5C8" />
        
        {/* === MOTHER'S HAIR - TOP LAYER === */}
        <Path
          d="M58 45
             C65 25, 90 15, 115 20
             C140 25, 155 42, 150 60
             C148 50, 135 38, 115 33
             C95 28, 75 32, 65 45
             C58 55, 52 68, 52 80
             L45 75
             C45 60, 50 50, 58 45
             Z"
          fill="#8B5A3C"
        />
        
        {/* Hair parting detail */}
        <Path
          d="M96 22 L98 50"
          stroke="#7A4A32"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* === MOTHER'S FACIAL FEATURES === */}
        {/* Left closed eye - curved line with lashes */}
        <Path
          d="M75 56 Q84 50, 93 56"
          stroke="#4A4A4A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left eyelashes */}
        <G stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round">
          <Path d="M77 53 L74 48" />
          <Path d="M82 50 L80 45" />
          <Path d="M88 49 L88 44" />
          <Path d="M92 52 L95 48" />
        </G>
        
        {/* Right closed eye - curved line with lashes */}
        <Path
          d="M103 56 Q112 50, 121 56"
          stroke="#4A4A4A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right eyelashes */}
        <G stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round">
          <Path d="M105 52 L102 48" />
          <Path d="M110 49 L110 44" />
          <Path d="M115 50 L117 45" />
          <Path d="M120 53 L123 48" />
        </G>
        
        {/* Gentle smile */}
        <Path
          d="M86 78 Q96 88, 106 78"
          stroke="#D4A594"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Soft blush on cheeks */}
        <Ellipse cx="72" cy="70" rx="8" ry="5" fill="#F8C4B4" opacity="0.4" />
        <Ellipse cx="120" cy="70" rx="8" ry="5" fill="#F8C4B4" opacity="0.4" />
        
        {/* === MOTHER'S NECK === */}
        <Path
          d="M82 98 L82 110 Q82 115, 88 118 L108 118 Q114 115, 114 110 L114 98"
          fill="#F5D5C8"
        />
        
        {/* === MOTHER'S CLOTHING/BODY - TEAL === */}
        <Path
          d="M42 118
             Q50 108, 75 105
             L88 108
             Q98 102, 108 108
             L121 105
             Q146 108, 154 118
             L165 160
             Q170 185, 165 210
             L30 210
             Q25 185, 32 160
             Z"
          fill="#6BAFA4"
        />
        
        {/* Clothing neckline - V shape */}
        <Path
          d="M75 108 Q98 125, 121 108"
          stroke="#5A9E93"
          strokeWidth="2.5"
          fill="none"
        />
        
        {/* === MOTHER'S ARMS === */}
        {/* Left arm holding baby */}
        <Path
          d="M42 125
             C30 135, 25 155, 30 175
             Q35 185, 45 182
             L55 165
             C50 150, 48 140, 52 130
             Z"
          fill="#F5D5C8"
        />
        
        {/* Right arm */}
        <Path
          d="M154 125
             C166 135, 170 155, 165 175
             Q160 185, 150 182
             L142 165
             C146 150, 148 140, 144 130
             Z"
          fill="#F5D5C8"
        />
        
        {/* Left hand visible */}
        <Ellipse cx="45" cy="178" rx="10" ry="8" fill="#F5D5C8" />
        
        {/* === BABY === */}
        {/* Baby's head */}
        <Ellipse cx="85" cy="138" rx="22" ry="20" fill="#F5D5C8" />
        
        {/* Baby's ear */}
        <Ellipse cx="65" cy="138" rx="5" ry="6" fill="#EBC8BA" />
        
        {/* Baby's tiny closed eye */}
        <Path
          d="M78 135 Q83 131, 88 135"
          stroke="#4A4A4A"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Baby's tiny lashes */}
        <G stroke="#4A4A4A" strokeWidth="1" strokeLinecap="round">
          <Path d="M80 133 L79 130" />
          <Path d="M84 132 L85 129" />
        </G>
        
        {/* Baby's little smile */}
        <Path
          d="M80 146 Q86 150, 92 146"
          stroke="#D4A594"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Baby's blush */}
        <Ellipse cx="95" cy="142" rx="5" ry="3" fill="#F8C4B4" opacity="0.4" />
        
        {/* === BABY'S BLANKET === */}
        <Path
          d="M62 152
             C55 165, 52 185, 60 200
             Q70 215, 95 220
             L130 220
             Q145 215, 148 195
             C152 175, 145 160, 130 152
             Q110 145, 85 148
             Z"
          fill="#7CC4B8"
        />
        
        {/* Blanket fold lines */}
        <Path
          d="M65 162 Q95 175, 125 160"
          stroke="#6BB4A8"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M68 180 Q98 190, 128 178"
          stroke="#6BB4A8"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </G>
    </Svg>
  );
}
