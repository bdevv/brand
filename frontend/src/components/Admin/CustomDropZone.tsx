import React, { PropsWithChildren } from "react";
import Dropzone from "react-dropzone";
interface CustomDropZoneProps {
  onDrop: (acceptedFile: Array<any>) => void;
}
const CustomDropZone: React.FC<PropsWithChildren<CustomDropZoneProps>> = ({
  onDrop,
}) => {
  return (
    <div>
      <Dropzone
        multiple={false}
        onDrop={(acceptedFiles) => {
          onDrop(acceptedFiles);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button className="w-[150px] h-[50px] bg-[#04AA6D] hover:bg-[#04aa6db6] text-white rounded-md">
                {" "}
                Click here
              </button>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default CustomDropZone;
