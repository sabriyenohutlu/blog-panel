import  { useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';

const ImageCropper: React.FC  = () => {
    const stageRef = useRef(null);

    useEffect(() => {
        if (stageRef.current) {
            const stage = stageRef.current;
            const layer = stage.findOne('Layer');

            const img = new window.Image();
            img.src = 'path/to/image.jpg';
            img.onload = () => {
                const konvaImage = new KonvaImage({
                    x: 50,
                    y: 50,
                    image: img,
                    width: img.width * 0.5,
                    height: img.height * 0.5,
                });

                layer.add(konvaImage);
                stage.batchDraw();
            };
        }
    }, []);

    return (
        <Stage ref={stageRef} width={600} height={400}>
            <Layer />
        </Stage>
    );
};

export default ImageCropper;
