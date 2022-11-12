export interface HoverStyle {
  position: string;
  backgroundColor: string;
  opacity: string;
  cursor: string;
  zIndex: string;
}
export default {
  COMMAND_KEY: 'Control',
  HELPER_KEY: 'i',
  HOVER_ID: 'hover-object',
  HOVER_STYLE: {
    position: 'absolute',
    backgroundColor: '#205081',
    opacity: '0.5',
    cursor: 'default',
    zIndex: '100000000000',
  },
  EMITTER_COMMANDS: {
    HOVER_CLICK: 'HOVER_CLICK',
  }
};
