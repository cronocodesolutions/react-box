import { BoxComponentStyles } from '../../types';

export interface BoxComponent {
  clean?: boolean;
  styles?: BoxComponentStyles;
  variants?: Record<string, BoxComponentStyles>;
  children?: Record<string, BoxComponent>;
}

export type Components = Record<string, BoxComponent>;

const boxComponents = {
  h1: {
    styles: { fontSize: 14 * 2.5 },
  },
  h2: {
    styles: { fontSize: 14 * 2 },
  },
  h3: {
    styles: { fontSize: 14 * 1.75 },
  },
  h4: {
    styles: { fontSize: 14 * 1.5 },
  },
  h5: {
    styles: { fontSize: 14 * 1.25 },
  },
  h6: {
    styles: { fontSize: 14 * 1 },
  },
  span: {
    styles: { inline: true },
  },
  button: {
    styles: {
      display: 'inline-flex',
      ai: 'center',
      jc: 'center',
      gap: 2,
      bgColor: 'indigo-600',
      color: 'white',
      fontWeight: 500,
      py: 2.5,
      px: 5,
      borderRadius: 2,
      b: 0,
      cursor: 'pointer',
      hover: {
        bgColor: 'indigo-700',
      },
      active: {
        bgColor: 'indigo-800',
      },
      focus: {
        outline: 2,
        outlineOffset: 2,
        outlineColor: 'indigo-200',
      },
      disabled: {
        bgColor: 'gray-200',
        color: 'gray-400',
        cursor: 'not-allowed',
        hover: {
          bgColor: 'gray-200',
        },
      },
      theme: {
        dark: {
          bgColor: 'indigo-500',
          hover: {
            bgColor: 'indigo-400',
          },
          active: {
            bgColor: 'indigo-600',
          },
          focus: {
            outlineColor: 'indigo-800',
          },
          disabled: {
            bgColor: 'gray-800',
            color: 'gray-600',
            hover: {
              bgColor: 'gray-800',
            },
          },
        },
      },
    },
    variants: {
      secondary: {
        bgColor: 'white',
        color: 'gray-900',
        b: 1,
        borderColor: 'gray-300',
        hover: {
          bgColor: 'gray-50',
        },
        active: {
          bgColor: 'gray-100',
        },
        focus: {
          borderColor: 'indigo-500',
          outlineColor: 'indigo-100',
        },
        disabled: {
          bgColor: 'gray-50',
          color: 'gray-400',
          borderColor: 'gray-200',
        },
        theme: {
          dark: {
            bgColor: 'gray-800',
            color: 'gray-100',
            borderColor: 'gray-700',
            hover: {
              bgColor: 'gray-700',
            },
            active: {
              bgColor: 'gray-600',
            },
            focus: {
              borderColor: 'indigo-400',
              outlineColor: 'indigo-900',
            },
            disabled: {
              bgColor: 'gray-900',
              color: 'gray-600',
              borderColor: 'gray-800',
            },
          },
        },
      },
      ghost: {
        bgColor: 'transparent',
        color: 'gray-700',
        hover: {
          bgColor: 'gray-100',
        },
        active: {
          bgColor: 'gray-200',
        },
        disabled: {
          bgColor: 'transparent',
          color: 'gray-400',
        },
        theme: {
          dark: {
            bgColor: 'transparent',
            color: 'gray-300',
            hover: {
              bgColor: 'gray-800',
            },
            active: {
              bgColor: 'gray-700',
            },
            disabled: {
              bgColor: 'transparent',
              color: 'gray-600',
            },
          },
        },
      },
    },
  },
  textbox: {
    styles: {
      display: 'inline-block',
      b: 1,
      borderColor: 'gray-300',
      bgColor: 'white',
      color: 'gray-900',
      borderRadius: 2,
      p: 3,
      px: 4,
      lineHeight: 20,
      hover: {
        borderColor: 'gray-400',
      },
      focus: {
        outline: 2,
        outlineOffset: 0,
        borderColor: 'indigo-500',
        outlineColor: 'indigo-200',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'gray-100',
        color: 'gray-400',
        borderColor: 'gray-200',
      },
      theme: {
        dark: {
          bgColor: 'gray-800',
          color: 'gray-100',
          borderColor: 'gray-700',
          hover: {
            borderColor: 'gray-600',
          },
          focus: {
            borderColor: 'indigo-400',
            outlineColor: 'indigo-900',
          },
          disabled: {
            bgColor: 'gray-900',
            color: 'gray-600',
            borderColor: 'gray-800',
          },
        },
      },
    },
    variants: {
      compact: {
        px: 2,
        py: 1,
        fontSize: 13,
      },
    },
  },
  textarea: {
    styles: {
      display: 'inline-block',
      b: 1,
      borderColor: 'gray-300',
      bgColor: 'white',
      color: 'gray-900',
      borderRadius: 2,
      p: 3,
      px: 4,
      hover: {
        borderColor: 'gray-400',
      },
      focus: {
        outline: 2,
        outlineOffset: 0,
        borderColor: 'indigo-500',
        outlineColor: 'indigo-200',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'gray-100',
        color: 'gray-400',
        borderColor: 'gray-200',
        resize: 'none',
      },
      theme: {
        dark: {
          bgColor: 'gray-800',
          color: 'gray-100',
          borderColor: 'gray-700',
          hover: {
            borderColor: 'gray-600',
          },
          focus: {
            borderColor: 'indigo-400',
            outlineColor: 'indigo-900',
          },
          disabled: {
            bgColor: 'gray-900',
            color: 'gray-600',
            borderColor: 'gray-800',
          },
        },
      },
    },
  },
  checkbox: {
    styles: {
      display: 'inline-block',
      appearance: 'none',
      b: 2,
      borderColor: 'gray-300',
      borderRadius: 1,
      p: 2,
      cursor: 'pointer',
      hover: {
        borderColor: 'indigo-400',
      },
      focus: {
        outline: 2,
        outlineOffset: 2,
        outlineColor: 'indigo-200',
      },
      checked: {
        bgColor: 'indigo-500',
        borderColor: 'indigo-500',
        bgImage: 'bg-img-checked',
      },
      indeterminate: {
        borderColor: 'indigo-500',
        bgImage: 'bg-img-indeterminate',
      },
      disabled: {
        cursor: 'not-allowed',
        borderColor: 'gray-200',
        checked: {
          bgColor: 'gray-300',
        },
        hover: {
          borderColor: 'gray-200',
        },
      },
      theme: {
        dark: {
          borderColor: 'gray-600',
          hover: {
            borderColor: 'indigo-400',
          },
          focus: {
            outlineColor: 'indigo-900',
          },
          checked: {
            bgColor: 'indigo-500',
            borderColor: 'indigo-500',
          },
          indeterminate: {
            borderColor: 'indigo-500',
          },
          disabled: {
            borderColor: 'gray-700',
            checked: {
              bgColor: 'gray-600',
            },
            hover: {
              borderColor: 'gray-700',
            },
          },
        },
      },
    },
    variants: {
      datagrid: {},
    },
  },
  radioButton: {
    styles: {
      appearance: 'none',
      b: 1,
      borderColor: 'gray-300',
      borderRadius: 3,
      p: 2,
      cursor: 'pointer',
      hover: {
        borderColor: 'indigo-400',
      },
      focus: {
        outline: 2,
        outlineOffset: 2,
        outlineColor: 'indigo-200',
      },
      checked: {
        bgColor: 'indigo-500',
        borderColor: 'indigo-500',
        bgImage: 'bg-img-radio',
      },
      disabled: {
        checked: {
          bgColor: 'gray-300',
          borderColor: 'gray-200',
        },
        cursor: 'not-allowed',
        borderColor: 'gray-200',
        hover: {
          borderColor: 'gray-200',
        },
      },
      theme: {
        dark: {
          borderColor: 'gray-600',
          hover: {
            borderColor: 'indigo-400',
          },
          focus: {
            outlineColor: 'indigo-900',
          },
          checked: {
            bgColor: 'indigo-500',
            borderColor: 'indigo-500',
          },
          disabled: {
            borderColor: 'gray-700',
            checked: {
              bgColor: 'gray-600',
            },
            hover: {
              borderColor: 'gray-700',
            },
          },
        },
      },
    },
  },
  dropdown: {
    styles: {
      display: 'inline-block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      textAlign: 'left',
      gap: 2,
      p: 3,
      cursor: 'pointer',
      bgColor: 'white',
      color: 'gray-900',
      b: 1,
      borderColor: 'gray-300',
      borderRadius: 2,
      userSelect: 'none',
      lineHeight: 20,
      minWidth: 40,
      transition: 'none',
      hover: {
        borderColor: 'gray-400',
      },
      focus: {
        outline: 2,
        outlineOffset: 0,
        borderColor: 'indigo-500',
        outlineColor: 'indigo-200',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'gray-100',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
      theme: {
        dark: {
          bgColor: 'gray-800',
          color: 'gray-100',
          borderColor: 'gray-700',
          hover: {
            borderColor: 'gray-600',
          },
          focus: {
            borderColor: 'indigo-400',
            outlineColor: 'indigo-900',
          },
          disabled: {
            bgColor: 'gray-900',
            color: 'gray-500',
            borderColor: 'gray-700',
          },
        },
      },
    },
    variants: {
      compact: {
        px: 2,
        py: 1,
        fontSize: 13,
      },
    },
    children: {
      items: {
        styles: {
          display: 'flex',
          d: 'column',
          gap: 1,
          p: 1,
          b: 1,
          borderRadius: 2,
          position: 'relative',
          bgColor: 'white',
          overflow: 'auto',
          maxHeight: 62,
          borderColor: 'gray-300',
          color: 'gray-900',
          shadow: 'medium',
          theme: {
            dark: {
              bgColor: 'gray-800',
              borderColor: 'gray-700',
              color: 'gray-100',
            },
          },
        },
      },
      item: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'pointer',
          borderRadius: 1,
          lineHeight: 20,
          hover: {
            bgColor: 'gray-100',
          },
          focus: {
            bgColor: 'indigo-50',
          },
          selected: {
            bgColor: 'indigo-50',
            cursor: 'default',
            hover: {
              bgColor: 'indigo-100',
            },
          },
          theme: {
            dark: {
              hover: {
                bgColor: 'gray-700',
              },
              focus: {
                bgColor: 'gray-700',
              },
              selected: {
                bgColor: 'indigo-900',
                hover: {
                  bgColor: 'indigo-800',
                },
              },
            },
          },
        },
        variants: {
          compact: {
            px: 2,
            py: 1,
          },
          multiple: {
            selected: {
              cursor: 'pointer',
            },
          },
        },
      },
      unselect: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'pointer',
          lineHeight: 20,
          borderRadius: 1,
          color: 'gray-500',
          hover: {
            bgColor: 'gray-100',
          },
          focus: {
            bgColor: 'gray-100',
          },
          selected: {
            bgColor: 'gray-100',
            cursor: 'default',
          },
          theme: {
            dark: {
              color: 'gray-400',
              hover: {
                bgColor: 'gray-700',
              },
              focus: {
                bgColor: 'gray-700',
              },
              selected: {
                bgColor: 'gray-700',
              },
            },
          },
        },
        variants: {
          compact: {
            px: 2,
            py: 1,
          },
        },
      },
      selectAll: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'pointer',
          lineHeight: 20,
          borderRadius: 1,
          color: 'gray-500',
          hover: {
            bgColor: 'gray-100',
          },
          focus: {
            bgColor: 'gray-100',
          },
          selected: {
            bgColor: 'gray-100',
            cursor: 'default',
          },
          theme: {
            dark: {
              color: 'gray-400',
              hover: {
                bgColor: 'gray-700',
              },
              focus: {
                bgColor: 'gray-700',
              },
              selected: {
                bgColor: 'gray-700',
              },
            },
          },
        },
        variants: {
          compact: {
            px: 2,
            py: 1,
          },
        },
      },
      emptyItem: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'default',
          lineHeight: 20,
          borderRadius: 1,
          color: 'gray-400',
          theme: {
            dark: {
              color: 'gray-500',
            },
          },
        },
        variants: {
          compact: {
            px: 2,
            py: 1,
          },
        },
      },
      icon: {
        styles: {
          position: 'absolute',
          top: 0,
          right: 0,
          height: 'fit',
          px: 1.5,
        },
      },
    },
  },
  label: { styles: {} },
  datagrid: {
    styles: {
      b: 1,
      bgColor: 'white',
      borderColor: 'gray-200',
      overflow: 'hidden',
      borderRadius: 3,
      shadow: 'large',
      theme: {
        dark: {
          bgColor: 'gray-900',
          borderColor: 'gray-800',
        },
      },
    },
    children: {
      topBar: {
        styles: {
          py: 3,
          px: 4,
          bb: 1,
          borderColor: 'gray-200',
          color: 'gray-800',
          gap: 3,
          ai: 'center',
          bgColor: 'gray-50',
          theme: {
            dark: {
              bgColor: 'gray-800',
              borderColor: 'gray-700',
              color: 'gray-200',
            },
          },
        },
        children: {
          globalFilter: {
            styles: {
              display: 'flex',
              ai: 'center',
              gap: 2,
            },
            children: {
              stats: {
                styles: {
                  fontSize: 13,
                  color: 'gray-500',
                  textWrap: 'nowrap',
                  theme: {
                    dark: {
                      color: 'gray-400',
                    },
                  },
                },
              },
              inputWrapper: {
                styles: {
                  display: 'flex',
                  position: 'relative',
                },
                children: {
                  icon: {
                    styles: {
                      display: 'flex',
                      position: 'absolute',
                      left: 2,
                      top: '1/2',
                      translateY: '-1/2',
                      pointerEvents: 'none',
                      color: 'gray-500',
                      theme: {
                        dark: {
                          color: 'gray-400',
                        },
                      },
                    },
                  },
                  input: {
                    styles: {
                      display: 'inline-block',
                      b: 1,
                      borderColor: 'gray-300',
                      bgColor: 'white',
                      color: 'gray-900',
                      borderRadius: 2,
                      py: 2,
                      fontSize: 13,
                      focus: {
                        outline: 2,
                        outlineOffset: 0,
                        borderColor: 'violet-500',
                        outlineColor: 'violet-100',
                      },
                      theme: {
                        dark: {
                          bgColor: 'gray-800',
                          borderColor: 'gray-700',
                          color: 'gray-100',
                          focus: {
                            borderColor: 'violet-500',
                            outlineColor: 'violet-950',
                          },
                        },
                      },
                    },
                  },
                  clear: {
                    styles: {
                      display: 'flex',
                      position: 'absolute',
                      right: 2,
                      top: '1/2',
                      translateY: '-1/2',
                      cursor: 'pointer',
                      fontSize: 13,
                      color: 'gray-500',
                      hover: {
                        color: 'gray-700',
                      },
                      theme: {
                        dark: {
                          color: 'gray-400',
                          hover: {
                            color: 'gray-200',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          contextMenu: {
            clean: true,
            styles: {
              cursor: 'pointer',
              p: 2,
              borderRadius: 2,
              color: 'gray-700',
              hover: {
                bgColor: 'gray-100',
              },
              theme: {
                dark: {
                  color: 'gray-300',
                  hover: {
                    bgColor: 'gray-800',
                  },
                },
              },
            },
            children: {
              tooltip: {
                styles: {
                  bgColor: 'white',
                  color: 'gray-900',
                  width: 56,
                  b: 1,
                  borderColor: 'gray-300',
                  borderRadius: 3,
                  display: 'flex',
                  d: 'column',
                  mt: 2,
                  py: 2,
                  translateX: -1,
                  shadow: 'large',
                  overflow: 'auto',
                  maxHeight: 100,
                  theme: {
                    dark: {
                      bgColor: 'gray-800',
                      borderColor: 'gray-700',
                      color: 'gray-100',
                    },
                  },
                },
                children: {
                  item: {
                    clean: true,
                    styles: {
                      display: 'flex',
                      gap: 2,
                      p: 3,
                      cursor: 'pointer',
                      color: 'gray-900',
                      hover: {
                        bgColor: 'violet-50',
                      },
                      theme: {
                        dark: {
                          color: 'gray-100',
                          hover: {
                            bgColor: 'gray-700',
                          },
                        },
                      },
                    },
                    children: {
                      icon: {
                        styles: {
                          width: 4,
                          color: 'violet-950',
                          theme: {
                            dark: {
                              color: 'violet-300',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          columnGroups: {
            styles: {
              gap: 2,
              ai: 'center',
            },
            children: {
              icon: {
                styles: {
                  color: 'gray-700',
                  width: 4,
                  theme: {
                    dark: {
                      color: 'gray-300',
                    },
                  },
                },
              },
              separator: {
                styles: {},
              },
              item: {
                styles: {
                  gap: 2,
                  ai: 'center',
                  b: 1,
                  borderColor: 'gray-300',
                  bgColor: 'white',
                  borderRadius: 2,
                  py: 2,
                  pl: 3,
                  pr: 2,
                  color: 'gray-800',
                  fontSize: 14,
                  fontWeight: 500,
                  shadow: 'small',
                  theme: {
                    dark: {
                      bgColor: 'gray-800',
                      borderColor: 'gray-700',
                      color: 'gray-200',
                    },
                  },
                },
                children: {
                  icon: {
                    styles: {
                      width: 3,
                      color: 'gray-500',
                      cursor: 'pointer',
                      hover: {
                        color: 'gray-700',
                      },
                      theme: {
                        dark: {
                          color: 'gray-400',
                          hover: {
                            color: 'gray-200',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      filter: {
        styles: {},
        children: {
          row: {
            styles: {
              bgColor: 'gray-50',
              bb: 1,
              borderColor: 'gray-200',
              theme: {
                dark: {
                  bgColor: 'gray-800',
                  borderColor: 'gray-700',
                },
              },
            },
          },
          cell: {
            styles: {
              display: 'flex',
              ai: 'center',
              p: 2,
              transition: 'none',
            },
            variants: {
              isPinned: {
                position: 'sticky',
                bgColor: 'gray-50',
                zIndex: 2,
                theme: {
                  dark: {
                    bgColor: 'gray-800',
                  },
                },
              },
              isFirstLeftPinned: {},
              isLastLeftPinned: {
                br: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-700',
                  },
                },
              },
              isFirstRightPinned: {
                bl: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-700',
                  },
                },
              },
              isLastRightPinned: {},
            },
          },
        },
      },
      header: {
        styles: {
          position: 'sticky',
          top: 0,
          width: 'max-content',
          minWidth: 'fit',
          zIndex: 1,
          bgColor: 'gray-50',
          theme: {
            dark: {
              bgColor: 'gray-800',
            },
          },
        },
        variants: {
          isResizeMode: { userSelect: 'none' },
        },
        children: {
          cell: {
            styles: {
              borderColor: 'gray-200',
              bb: 1,
              minHeight: 12,
              position: 'relative',
              transition: 'none',
              fontSize: 13,
              fontWeight: 600,
              color: 'gray-800',
              py: 3.5,
              theme: {
                dark: {
                  borderColor: 'gray-700',
                  color: 'gray-200',
                },
              },
            },
            variants: {
              isPinned: {
                position: 'sticky',
                zIndex: 2,
                bgColor: 'gray-50',
                theme: {
                  dark: {
                    bgColor: 'gray-800',
                  },
                },
              },
              isFirstLeftPinned: {},
              isLastLeftPinned: {
                br: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-700',
                  },
                },
              },
              isFirstRightPinned: {
                bl: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-700',
                  },
                },
              },
              isLastRightPinned: {},
              isSortable: {
                cursor: 'pointer',
                hover: {
                  bgColor: 'gray-100',
                },
                theme: {
                  dark: {
                    hover: {
                      bgColor: 'gray-800',
                    },
                  },
                },
              },
              isRowSelected: {},
              isRowSelection: {},
              isRowNumber: { jc: 'center' },
            },
            children: {
              contextMenu: {
                clean: true,
                styles: {
                  width: 6,
                  height: 6,
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderRadius: 1,
                  borderColor: 'gray-200',
                  display: 'flex',
                  jc: 'center',
                  ai: 'center',
                  transition: 'none',
                  color: 'gray-600',
                  hover: { bgColor: 'gray-300' },
                  theme: {
                    dark: {
                      color: 'gray-400',
                      hover: { bgColor: 'gray-700' },
                    },
                  },
                },
                children: {
                  icon: {
                    styles: {},
                  },
                  tooltip: {
                    styles: {
                      bgColor: 'white',
                      color: 'gray-900',
                      width: 56,
                      b: 1,
                      borderColor: 'gray-300',
                      borderRadius: 3,
                      display: 'flex',
                      d: 'column',
                      py: 2,
                      overflow: 'hidden',
                      shadow: 'medium',
                      theme: {
                        dark: {
                          bgColor: 'gray-800',
                          borderColor: 'gray-700',
                          color: 'gray-100',
                        },
                      },
                    },
                    children: {
                      item: {
                        clean: true,
                        styles: {
                          display: 'flex',
                          gap: 2,
                          p: 3,
                          cursor: 'pointer',
                          color: 'gray-900',
                          hover: { bgColor: 'violet-50' },
                          theme: {
                            dark: {
                              color: 'gray-100',
                              hover: { bgColor: 'gray-700' },
                            },
                          },
                        },
                        children: {
                          icon: {
                            styles: {
                              width: 4,
                              color: 'violet-950',
                              theme: {
                                dark: {
                                  color: 'violet-300',
                                },
                              },
                            },
                          },
                          separator: {
                            styles: {
                              bb: 1,
                              my: 2,
                              borderColor: 'gray-300',
                              theme: {
                                dark: {
                                  borderColor: 'gray-700',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              resizer: {
                styles: {
                  width: 0.5,
                  height: 'fit',
                  bgColor: 'gray-400',
                  hoverGroup: { resizer: { bgColor: 'gray-600' } },
                },
              },
            },
          },
        },
      },
      body: {
        styles: {},
        children: {
          cell: {
            styles: {
              bb: 1,
              borderColor: 'gray-200',
              transition: 'none',
              ai: 'center',
              hoverGroup: {
                'grid-row': {
                  bgColor: 'gray-100',
                },
              },
              theme: {
                dark: {
                  borderColor: 'gray-800',
                  hoverGroup: {
                    'grid-row': {
                      bgColor: 'gray-700',
                    },
                  },
                },
              },
            },
            variants: {
              isPinned: {
                position: 'sticky',
                bgColor: 'white',
                zIndex: 1,
                theme: {
                  dark: {
                    bgColor: 'gray-900',
                  },
                },
              },
              isFirstLeftPinned: {},
              isLastLeftPinned: {
                br: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-800',
                  },
                },
              },
              isFirstRightPinned: {
                bl: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-800',
                  },
                },
              },
              isLastRightPinned: {},
              isRowNumber: { jc: 'right' },
              isRowSelection: {},
              isRowSelected: {},
            },
          },
        },
      },
      bottomBar: {
        styles: {
          py: 3,
          px: 4,
          lineHeight: 36,
          bgColor: 'gray-50',
          bt: 1,
          borderColor: 'gray-200',
          gap: 4,
          ai: 'center',
          fontSize: 14,
          color: 'gray-800',
          theme: {
            dark: {
              bgColor: 'gray-800',
              borderColor: 'gray-700',
              color: 'gray-200',
            },
          },
        },
      },
    },
  },
} satisfies Components;

export default boxComponents;
