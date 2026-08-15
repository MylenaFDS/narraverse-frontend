import { useState } from "react"

import {
  uploadRegionSceneImage,
  type RegionScene,
} from "../../../services/api"

import ExplorerView from "./ExplorerView"


type Props = {
  scene: RegionScene | null
  onClose: () => void
}


export default function RegionSceneModal({
  scene,
  onClose,
}: Props) {

  const [isExploring, setIsExploring] =
    useState(false)

  const [currentScene, setCurrentScene] =
    useState<RegionScene | null>(
      scene,
    )

  const [imageFile, setImageFile] =
    useState<File | null>(null)

  const [isUploading, setIsUploading] =
    useState(false)


  if (!currentScene) {
    return null
  }


  // ==========================================
  // Entrar no Explorer
  // ==========================================

  if (isExploring) {

    return (
      <ExplorerView
        scene={currentScene}
        onClose={() =>
          setIsExploring(false)
        }
      />
    )

  }


  // ==========================================
  // URL da imagem
  // ==========================================

  function getImageUrl(
    imageUrl?: string | null,
  ) {

    if (!imageUrl) {
      return null
    }

    if (
      imageUrl.startsWith("http")
    ) {

      return imageUrl

    }

    return `http://127.0.0.1:8001/${imageUrl}`

  }


  const imageUrl =
    getImageUrl(
      currentScene.image_url,
    )


  // ==========================================
  // Selecionar imagem
  // ==========================================

  function handleSelectImage(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {

    const file =
      event.target.files?.[0] ?? null

    setImageFile(
      file,
    )

  }


  // ==========================================
  // Enviar imagem
  // ==========================================

  async function handleUploadImage() {

    if (
      !imageFile ||
      !currentScene
    ) {
      return
    }


    try {

      setIsUploading(
        true,
      )


      const updatedScene =
        await uploadRegionSceneImage(
          currentScene.id,
          imageFile,
        )


      setCurrentScene(
        updatedScene,
      )


      setImageFile(
        null,
      )


    } catch (error) {

      console.error(
        "Erro ao enviar imagem:",
        error,
      )


      alert(
        "Não foi possível adicionar a imagem à cena.",
      )

    } finally {

      setIsUploading(
        false,
      )

    }

  }


  return (

    <div
      className="
        fixed
        inset-0
        z-[80]
        bg-black/90
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-6
      "
      onClick={onClose}
    >

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          relative
          w-full
          max-w-6xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          border
          border-[#e0a96d]/30
          bg-[#12090b]
          shadow-[0_0_50px_rgba(0,0,0,0.8)]
        "
      >

        {/* ================================= */}
        {/* Fechar */}
        {/* ================================= */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            z-20
            text-[#f2e9e4]
            hover:text-[#e0a96d]
            text-xl
          "
        >
          ✕
        </button>


        {/* ================================= */}
        {/* Imagem */}
        {/* ================================= */}

        {imageUrl ? (

          <div className="relative">

            <img
              src={imageUrl}
              alt={currentScene.title}
              className="
                w-full
                max-h-[70vh]
                object-cover
                rounded-t-3xl
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#12090b]
                via-transparent
                to-black/20
              "
            />

          </div>

        ) : (

          <div
            className="
              h-[420px]
              flex
              flex-col
              items-center
              justify-center
              gap-4
              text-[#c9ada7]/60
              bg-black/40
              rounded-t-3xl
            "
          >

            <span className="text-5xl">
              🖼️
            </span>

            <span>
              Nenhuma imagem adicionada
              a esta cena.
            </span>

          </div>

        )}


        {/* ================================= */}
        {/* Conteúdo */}
        {/* ================================= */}

        <div className="p-6">

          <h2
            className="
              text-3xl
              font-display
              text-[#e0a96d]
              mb-3
            "
          >
            🖼️ {currentScene.title}
          </h2>


          {currentScene.description && (

            <p
              className="
                text-[#c9ada7]
                leading-relaxed
                whitespace-pre-wrap
                mb-5
              "
            >
              {currentScene.description}
            </p>

          )}


          {/* ================================= */}
          {/* Upload */}
          {/* ================================= */}

          <div
            className="
              mb-5
              rounded-2xl
              border
              border-[#e0a96d]/20
              bg-black/20
              p-4
            "
          >

            <h3
              className="
                text-[#e0a96d]
                font-semibold
                mb-3
              "
            >
              {imageUrl
                ? "Alterar imagem"
                : "Adicionar imagem"}
            </h3>


            <div className="flex flex-wrap gap-3">

              <label
                className="
                  cursor-pointer
                  bg-black/40
                  border
                  border-[#e0a96d]/30
                  text-[#f2e9e4]
                  px-4
                  py-2
                  rounded-xl
                  hover:border-[#e0a96d]
                  hover:text-[#e0a96d]
                  transition
                "
              >

                📷{" "}
                {imageFile
                  ? "Trocar arquivo"
                  : imageUrl
                    ? "Escolher nova imagem"
                    : "Adicionar imagem"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleSelectImage
                  }
                  className="hidden"
                />

              </label>


              {imageFile && (

                <button
                  type="button"
                  onClick={
                    handleUploadImage
                  }
                  disabled={
                    isUploading
                  }
                  className="
                    bg-[#e0a96d]
                    text-black
                    px-4
                    py-2
                    rounded-xl
                    font-semibold
                    hover:brightness-110
                    disabled:opacity-50
                    transition
                  "
                >

                  {isUploading
                    ? "Enviando..."
                    : "Salvar imagem"}

                </button>

              )}

            </div>


            {imageFile && (

              <p
                className="
                  mt-3
                  text-sm
                  text-[#c9ada7]/70
                  truncate
                "
              >
                Arquivo selecionado:{" "}
                {imageFile.name}
              </p>

            )}

          </div>


          {/* ================================= */}
          {/* Ações */}
          {/* ================================= */}

          <div className="flex gap-3">

            <button
              type="button"
              onClick={() =>
                setIsExploring(
                  true,
                )
              }
              className="
                bg-[#e0a96d]
                text-black
                px-5
                py-3
                rounded-xl
                font-semibold
                hover:brightness-110
                transition
              "
            >
              Explorar
            </button>


            <button
              type="button"
              onClick={onClose}
              className="
                bg-red-600
                px-5
                py-3
                rounded-xl
                font-semibold
                hover:bg-red-500
                transition
              "
            >
              Fechar
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}