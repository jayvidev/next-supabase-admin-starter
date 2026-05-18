import type {
  AnimationOptions,
  AnimationPlaybackControlsWithThen,
  DOMKeyframesDefinition,
  ElementOrSelector,
} from 'motion'
import { animateMini } from 'motion'

export function animateDom(
  el: ElementOrSelector,
  keyframes: DOMKeyframesDefinition,
  options?: AnimationOptions
): AnimationPlaybackControlsWithThen {
  return animateMini(el, keyframes, options)
}
