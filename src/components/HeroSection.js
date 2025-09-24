import React from "react";
import cercoImage from "../assets/cerco-190.webp";
import { Container, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import "./HeroSection.css";

const HeroSection = ({ handleShowModal }) => {
  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.4 } },
  };

  return (
    <div
      className="hero-section"
      style={{ backgroundImage: `url(${cercoImage})` }}
    >
      <div className="hero-parallax-bg"></div>{" "}
      {/* Parallax background element */}
      <Container className="hero-content">
        <motion.h1
          className="display-4 fw-bold"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Cerco Vibrados del Sur de Chile
        </motion.h1>
        <motion.p
          className="lead"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Fábrica familiar de cercos vibrados para el sur de Chile, ofreciendo
          soluciones duraderas y estéticas para tu propiedad.
        </motion.p>
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <Button size="lg" className="btn-hero" onClick={handleShowModal}>
            Mas informacion
          </Button>
        </motion.div>
      </Container>
      <div className="slide-indicators">
        <span CLASSNAME="SLIDE-INDICATOR ACTIVE"></span>
        <span className="slide-indicator"></span>
        <span className="slide-indicator"></span>
      </div>
    </div>
  );
};

export default HeroSection;
