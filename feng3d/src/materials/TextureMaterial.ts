namespace feng3d
{

    export interface UniformsMap { texture: TextureUniforms }
    export class TextureUniforms
    {
        __class__: "feng3d.TextureUniforms" = "feng3d.TextureUniforms";
        /** 
         * 颜色
         */
        @serialize
        @oav()
        u_color = new Color4();

        /**
         * 纹理数据
         */
        @oav()
        @serializeAssets
        s_texture = UrlImageTexture2D.default;
    }

    shaderConfig.shaders["texture"].cls = TextureUniforms;
}