import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function SimpleSlider({ images, height, width }) {
  console.log(images, height, width, "images, height, width");
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`w-[${width}] h-[${height}] bg-gray-200 overflow-hidden`}
        >
          <img
            className="w-full h-full  rounded-md object-contain overflow-hidden"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`}
            alt="post image"
          />
        </div>
      ))}
    </Slider>
  );
}
