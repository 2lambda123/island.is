import { FC, useEffect, useRef, useState } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import * as styles from './AudioPlayer.css'
import ProgressBar from '../ProgressBar/ProgressBar'
interface Props {
  url: string
}

const AudioPlayer: FC<Props> = ({ url }) => {
  const [trackProgress, setTrackProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const audioProgress = trackProgress / duration ?? 0

  const toggleAudio = () => {
    if (hasEnded) {
      setHasEnded(false)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const setTimeChange = (durationPercent?: number) => {
    if (!durationPercent || !audioRef.current) {
      return
    }
    audioRef.current.currentTime = duration * durationPercent
  }

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    return format(date, 'm:ss')
  }

  return (
    <GridContainer className={styles.container}>
      <GridRow className={styles.audio} align="center" alignItems="center">
        <GridColumn span="1/12">
          <audio
            ref={audioRef}
            preload="metadata"
            muted={isMuted}
            onEnded={() => setHasEnded(true)}
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setTrackProgress(e.currentTarget.currentTime)}
            onCanPlay={() => setIsReady(true)}
          >
            <source type="audio/mp3" src={url} />
          </audio>
          <Box display="flex" justifyContent="center">
            {isReady && (
              <button
                disabled={!isReady}
                title={
                  hasEnded
                    ? 'Replay audio'
                    : isPlaying
                    ? 'Pause audio'
                    : 'Play audio'
                }
                onClick={toggleAudio}
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
          <Text variant="small">{`${formatTime(trackProgress)} / ${formatTime(
            duration,
          )}`}</Text>
        </GridColumn>
        <GridColumn span="6/12">
          <ProgressBar
            progress={audioProgress}
            onClick={setTimeChange}
            renderProgressBar={isReady}
            variant
          />
        </GridColumn>
        <GridColumn span="1/12">
          <Box display="flex" justifyContent="center">
            <button
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
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
            <Icon icon="ellipsisVertical" color="blue400" />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default AudioPlayer
