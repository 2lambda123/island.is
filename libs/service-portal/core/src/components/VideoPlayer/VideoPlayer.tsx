import { FC, useEffect, useRef, useState } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import * as styles from './VideoPlayer.css'
import ProgressBar from '../ProgressBar/ProgressBar'
import cn from 'classnames'

interface Props {
  url: string
}

const VideoPlayer: FC<Props> = ({ url }) => {
  const [trackProgress, setTrackProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  const progress = trackProgress / duration ?? 0

  const toggleVideo = () => {
    if (hasEnded) {
      setHasEnded(false)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        videoRef.current.play()
      }
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  const setTimeChange = (durationPercent?: number) => {
    if (!durationPercent || !videoRef.current) {
      return
    }
    videoRef.current.currentTime = duration * durationPercent
  }

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    return format(date, 'm:ss')
  }

  return (
    <Box ref={containerRef} className={styles.container} position="relative">
      <video
        className={cn(styles.videoPlayer, { [styles.hidden]: !isReady })}
        ref={videoRef}
        preload="metadata"
        muted={isMuted}
        onEnded={() => setHasEnded(true)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTrackProgress(e.currentTarget.currentTime)}
        onCanPlay={() => setIsReady(true)}
      >
        <source type="video/mp4" src={url} />
      </video>
      {!isReady && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          height="full"
        >
          <LoadingDots large />
        </Box>
      )}
      {isReady && (
        <GridContainer className={styles.controls}>
          <GridRow className={styles.video} align="center" alignItems="center">
            <GridColumn span="1/12">
              <Box display="flex" justifyContent="center">
                {isReady && (
                  <button
                    disabled={!isReady}
                    title={
                      hasEnded
                        ? 'Replay video'
                        : isPlaying
                        ? 'Pause video'
                        : 'Play video'
                    }
                    onClick={toggleVideo}
                  >
                    <Icon
                      icon={
                        hasEnded
                          ? 'reload'
                          : isPlaying
                          ? 'removeCircle'
                          : 'playCircle'
                      }
                      size="large"
                      color="blue400"
                    />
                  </button>
                )}
              </Box>
            </GridColumn>
            <GridColumn span="2/12">
              <Text variant="small">{`${formatTime(
                trackProgress,
              )} / ${formatTime(duration)}`}</Text>
            </GridColumn>
            <GridColumn span="6/12">
              <ProgressBar
                progress={progress}
                onClick={setTimeChange}
                renderProgressBar={isReady}
                variant
              />
            </GridColumn>
            <GridColumn span="1/12">
              <Box display="flex" justifyContent="center">
                <button
                  title={isMuted ? 'Unmute video' : 'Mute video'}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  <Icon
                    icon={isMuted ? 'lockClosed' : 'cellular'}
                    size="large"
                    color="blue400"
                  />
                </button>
              </Box>
            </GridColumn>
            <GridColumn span="1/12">
              <Box display="flex" justifyContent="center">
                <button
                  title={isFullscreen ? 'Close fullscreen' : 'Open fullscreen'}
                  onClick={toggleFullscreen}
                >
                  <Icon
                    icon={isFullscreen ? 'fileTrayFull' : 'filter'}
                    color="blue400"
                  />
                </button>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
    </Box>
  )
}

export default VideoPlayer
