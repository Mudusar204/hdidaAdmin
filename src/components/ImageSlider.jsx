import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function SimpleSlider({ images, height, width }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      {images.map((image) => (
        <div className={`w-[${width}] h-[${height}] bg-gray-200`}>
          <img
            className="w-full h-full rounded-md object-contain"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`}
            alt="post image"
          />
        </div>
      ))}
    </Slider>
  );
}
