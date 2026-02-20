import React from 'react';
import Svg, { Path, Circle, Ellipse, G, Defs, ClipPath } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function MotherBabyIllustration({ size = 200 }: Props) {
  const scale = size / 200;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="circleClip">
          <Circle cx="100" cy="100" r="95" />
        </ClipPath>
      </Defs>
      
      <G clipPath="url(#circleClip)">
        {/* Background - soft pink */}
        <Circle cx="100" cy="100" r="100" fill="#FEEBF7" />
        
        {/* Mother's flowing hair - back portion */}
        <Path
          d="M55 45 
             C45 55, 40 75, 42 95
             C44 115, 48 135, 55 155
             C58 165, 62 175, 68 185
             L72 185
             C66 175, 62 165, 60 155
             C54 135, 50 115, 50 95
             C50 75, 55 60, 62 50
             L55 45 Z"
          fill="#8B5A3C"
        />
        
        {/* Mother's head/face */}
        <Ellipse cx="95" cy="58" rx="32" ry="35" fill="#F4D1C4" />
        
        {/* Mother's hair - top and side */}
        <Path
          d="M63 40
             C70 25, 90 18, 110 22
             C130 26, 140 40, 138 55
             C136 45, 125 35, 110 32
             C95 29, 80 32, 70 42
             C65 48, 62 56, 62 65
             L58 65
             C58 52, 60 45, 63 40 Z"
          fill="#8B5A3C"
        />
        
        {/* Hair flowing down right side */}
        <Path
          d="M125 45
             C135 55, 140 70, 142 90
             C144 110, 140 135, 135 160
             C132 175, 128 190, 125 200
             L118 200
             C122 185, 126 170, 128 155
             C132 135, 135 115, 134 95
             C133 75, 128 60, 120 50
             L125 45 Z"
          fill="#8B5A3C"
        />
        
        {/* Hair strand detail */}
        <Path
          d="M70 50 C65 65, 58 85, 55 110"
          stroke="#7A4A32"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M130 55 C135 75, 138 95, 136 120"
          stroke="#7A4A32"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Mother's closed left eye */}
        <Path
          d="M78 52 Q85 48, 92 52"
          stroke="#3D3D3D"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Left eyelashes */}
        <Path
          d="M80 50 L78 46"
          stroke="#3D3D3D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M85 48 L84 44"
          stroke="#3D3D3D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M90 49 L91 45"
          stroke="#3D3D3D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Mother's closed right eye */}
        <Path
          d="M100 52 Q107 48, 114 52"
          stroke="#3D3D3D"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Right eyelashes */}
        <Path
          d="M102 49 L101 45"
          stroke="#3D3D3D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M107 48 L107 44"
          stroke="#3D3D3D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M112 50 L114 46"
          stroke="#3D3D3D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Mother's gentle smile */}
        <Path
          d="M88 72 Q96 80, 104 72"
          stroke="#C9A090"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Slight blush on cheeks */}
        <Ellipse cx="76" cy="65" rx="6" ry="4" fill="#F5C4B8" opacity="0.5" />
        <Ellipse cx="116" cy="65" rx="6" ry="4" fill="#F5C4B8" opacity="0.5" />
        
        {/* Mother's neck */}
        <Path
          d="M85 88 L85 100 Q85 105, 90 108 L102 108 Q107 105, 107 100 L107 88"
          fill="#F4D1C4"
        />
        
        {/* Mother's clothing/top - teal color */}
        <Path
          d="M50 108
             Q55 100, 75 98
             L85 100
             Q96 95, 107 100
             L117 98
             Q137 100, 145 108
             L155 140
             Q158 160, 155 180
             L150 210
             L45 210
             L40 180
             Q38 160, 42 140
             L50 108 Z"
          fill="#6BA89E"
        />
        
        {/* Clothing neckline detail */}
        <Path
          d="M75 100 Q96 110, 117 100"
          stroke="#5A9389"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Mother's left arm (cradling baby) */}
        <Path
          d="M50 115
             C42 125, 38 140, 40 155
             Q42 165, 50 170
             L60 155
             C55 145, 52 135, 55 125
             L50 115 Z"
          fill="#F4D1C4"
        />
        
        {/* Mother's right arm */}
        <Path
          d="M145 115
             C152 125, 155 140, 153 155
             Q150 165, 142 168
             L135 155
             C138 145, 140 135, 138 125
             L145 115 Z"
          fill="#F4D1C4"
        />
        
        {/* Baby's head */}
        <Ellipse cx="82" cy="130" rx="18" ry="16" fill="#F4D1C4" />
        
        {/* Baby's ear */}
        <Ellipse cx="66" cy="130" rx="4" ry="5" fill="#EBC4B6" />
        
        {/* Baby's closed eye */}
        <Path
          d="M76 128 Q80 125, 84 128"
          stroke="#3D3D3D"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Baby's tiny eyelashes */}
        <Path
          d="M78 126 L77 124"
          stroke="#3D3D3D"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <Path
          d="M82 126 L83 124"
          stroke="#3D3D3D"
          strokeWidth="1"
          strokeLinecap="round"
        />
        
        {/* Baby's peaceful smile */}
        <Path
          d="M78 136 Q82 139, 86 136"
          stroke="#C9A090"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Baby's body wrapped in blanket */}
        <Path
          d="M68 142
             C62 150, 60 165, 65 180
             Q70 195, 85 200
             L120 200
             Q130 195, 132 180
             C135 165, 130 150, 120 145
             Q105 138, 85 140
             L68 142 Z"
          fill="#7DBEB2"
        />
        
        {/* Blanket fold detail */}
        <Path
          d="M70 150 Q90 158, 115 148"
          stroke="#6BA89E"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M72 165 Q92 172, 118 162"
          stroke="#6BA89E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        
        {/* Small highlight on baby's cheek */}
        <Ellipse cx="90" cy="132" rx="3" ry="2" fill="#FAE0D8" opacity="0.6" />
      </G>
    </Svg>
  );
}
