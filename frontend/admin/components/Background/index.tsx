// MySvgBackground.tsx
import React from 'react';
import styled from 'styled-components';

const SvgBackgroundContainer = styled.div`
  position: relative;
  width: 750px;
  height: 500px;
  background: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="utf-8"?> <!-- Paste your SVG data here -->');
  background-size: cover;
  background-position: center;
`;

const OverlayContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Additional styling for your overlay content */
`;

export default function MySvgBackground({ children }) {
    return (
        <SvgBackgroundContainer>
            <OverlayContent>
                {children}
            </OverlayContent>
        </SvgBackgroundContainer>
    )
};
