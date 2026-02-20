import React from 'react';
import Svg, { Path, Circle, Ellipse, G, Line } from 'react-native-svg';

interface Props {
  size?: number;
}

// Professional line-art style illustration of mother breastfeeding
export default function MotherBabyIllustration({ size = 240 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240">
      {/* Soft pink background circle */}
      <Circle cx="120" cy="120" r="118" fill="#FFF5FA" />
      
      <G>
        {/* === MOTHER'S HAIR - FLOWING STYLE === */}
        {/* Back hair - left side flowing down */}
        <Path
          d="M52 55 
             C42 75, 38 100, 42 130
             C44 155, 48 180, 55 205
             C56 210, 58 215, 60 220
             L68 218
             C64 210, 60 200, 57 185
             C52 160, 50 135, 52 110
             C54 90, 58 72, 62 60
             Z"
          fill="#96694C"
        />
        
        {/* Back hair - right side flowing down */}
        <Path
          d="M175 50
             C188 70, 192 100, 188 140
             C185 170, 178 195, 172 220
             L164 218
             C170 195, 176 170, 178 145
             C182 110, 180 80, 170 58
             Z"
          fill="#96694C"
        />
        
        {/* === MOTHER'S FACE === */}
        <Ellipse cx="115" cy="72" rx="42" ry="45" fill="#FCEADE" />
        
        {/* === TOP HAIR === */}
        <Path
          d="M62 48
             C72 22, 100 10, 130 15
             C160 20, 182 40, 178 65
             C176 52, 160 38, 135 32
             C110 26, 85 30, 72 45
             C64 55, 56 70, 54 88
             L46 85
             C46 68, 52 55, 62 48
             Z"
          fill="#96694C"
        />
        
        {/* Hair wave detail - left */}
        <Path
          d="M58 60 C52 80, 48 105, 50 130"
          stroke="#84593F"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Hair wave detail - right */}
        <Path
          d="M172 58 C180 80, 182 110, 178 145"
          stroke="#84593F"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* === FACIAL FEATURES - ELEGANT LINE ART === */}
        
        {/* Left eyebrow */}
        <Path
          d="M82 52 Q92 48, 102 52"
          stroke="#5C4033"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Right eyebrow */}
        <Path
          d="M118 52 Q128 48, 138 52"
          stroke="#5C4033"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Left closed eye - elegant curve */}
        <Path
          d="M82 62 Q92 56, 102 62"
          stroke="#3D3D3D"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Left eyelashes - delicate */}
        <G stroke="#3D3D3D" strokeWidth="1.2" strokeLinecap="round">
          <Line x1="84" y1="59" x2="82" y2="54" />
          <Line x1="89" y1="57" x2="88" y2="52" />
          <Line x1="95" y1="56" x2="95" y2="51" />
          <Line x1="100" y1="58" x2="102" y2="53" />
        </G>
        
        {/* Right closed eye - elegant curve */}
        <Path
          d="M118 62 Q128 56, 138 62"
          stroke="#3D3D3D"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Right eyelashes - delicate */}
        <G stroke="#3D3D3D" strokeWidth="1.2" strokeLinecap="round">
          <Line x1="120" y1="58" x2="118" y2="53" />
          <Line x1="125" y1="56" x2="125" y2="51" />
          <Line x1="131" y1="57" x2="132" y2="52" />
          <Line x1="136" y1="59" x2="138" y2="54" />
        </G>
        
        {/* Nose - subtle line */}
        <Path
          d="M115 68 L113 78 Q115 82, 118 80"
          stroke="#D4B5A0"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Peaceful smile */}
        <Path
          d="M102 92 Q115 102, 128 92"
          stroke="#C4967E"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Soft blush */}
        <Ellipse cx="85" cy="78" rx="10" ry="6" fill="#FDDDD5" opacity="0.5" />
        <Ellipse cx="145" cy="78" rx="10" ry="6" fill="#FDDDD5" opacity="0.5" />
        
        {/* === NECK === */}
        <Path
          d="M98 112 L98 125 Q100 130, 108 132 L130 132 Q138 130, 140 125 L140 112"
          fill="#FCEADE"
        />
        
        {/* === MOTHER'S CLOTHING - TEAL/SAGE GREEN === */}
        <Path
          d="M48 132
             Q58 118, 90 115
             L108 120
             Q120 112, 132 120
             L150 115
             Q182 118, 192 132
             L205 185
             Q210 215, 205 245
             L35 245
             Q30 215, 38 185
             Z"
          fill="#6BAFA4"
        />
        
        {/* Neckline - V shape elegant */}
        <Path
          d="M90 118 Q120 140, 150 118"
          stroke="#5A9E93"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Clothing fold detail */}
        <Path
          d="M75 145 Q90 152, 105 148"
          stroke="#5A9E93"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        
        {/* === MOTHER'S ARMS === */}
        {/* Left arm - cradling baby */}
        <Path
          d="M48 140
             C32 155, 28 180, 35 205
             Q42 218, 55 215
             L68 195
             C62 178, 58 162, 62 148
             Z"
          fill="#FCEADE"
        />
        
        {/* Right arm - supporting */}
        <Path
          d="M192 140
             C205 155, 208 180, 202 205
             Q195 218, 182 215
             L170 195
             C175 178, 178 162, 175 148
             Z"
          fill="#FCEADE"
        />
        
        {/* Left hand detail */}
        <Ellipse cx="52" cy="210" rx="12" ry="10" fill="#FCEADE" />
        
        {/* === BABY === */}
        {/* Baby's head - round and peaceful */}
        <Ellipse cx="100" cy="158" rx="26" ry="24" fill="#FCEADE" />
        
        {/* Baby's ear */}
        <Ellipse cx="76" cy="158" rx="6" ry="7" fill="#F5D5C5" />
        
        {/* Baby's closed eye - tiny and peaceful */}
        <Path
          d="M92 154 Q98 149, 104 154"
          stroke="#3D3D3D"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Baby's tiny lashes */}
        <G stroke="#3D3D3D" strokeWidth="1" strokeLinecap="round">
          <Line x1="94" y1="152" x2="93" y2="148" />
          <Line x1="99" y1="150" x2="99" y2="146" />
          <Line x1="103" y1="152" x2="104" y2="148" />
        </G>
        
        {/* Baby's peaceful smile */}
        <Path
          d="M94 168 Q100 173, 106 168"
          stroke="#C4967E"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Baby's blush */}
        <Ellipse cx="112" cy="162" rx="6" ry="4" fill="#FDDDD5" opacity="0.4" />
        
        {/* Baby's tiny hand reaching */}
        <Path
          d="M118 172 C122 170, 126 168, 128 172 C130 176, 126 180, 120 178"
          fill="#FCEADE"
        />
        
        {/* === BABY'S BLANKET/WRAP === */}
        <Path
          d="M72 175
             C62 195, 58 220, 68 245
             Q85 260, 120 260
             L160 260
             Q180 255, 185 235
             C190 210, 180 188, 160 178
             Q135 168, 105 172
             Z"
          fill="#7CC4B8"
        />
        
        {/* Blanket fold lines */}
        <Path
          d="M75 190 Q110 205, 155 188"
          stroke="#6BB4A8"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M78 210 Q115 222, 158 208"
          stroke="#6BB4A8"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <Path
          d="M82 230 Q118 240, 155 228"
          stroke="#6BB4A8"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
      </G>
    </Svg>
  );
}
