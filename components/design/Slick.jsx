"use client"
import React, { Component } from "react";
import Slider from "react-slick";

export default class Slick extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div className='auth_slider'>
        <div className='cont position-relative'>
            <Slider {...settings}>
                <div className="auth_slider_image img_1">
                </div>
                <div className="auth_slider_image img_1">
                </div>
                <div className="auth_slider_image img_1">
                </div>
            </Slider>
        </div>
      </div>
    );
  }
}