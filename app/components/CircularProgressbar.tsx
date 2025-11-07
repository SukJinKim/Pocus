import clsx from 'clsx';
import {
  CircularProgressbar as BaseCircularProgressbar,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type CircularProgressbarProps = {
  remaining: number;
  total: number;
  text?: string;
  className?: string;
  pathColor?: string;
  trailColor?: string;
  textColor?: string;
  strokeWidth?: number;
};

function CircularProgressbar({
  remaining,
  total,
  text,
  className,
  pathColor = '#76e5b1',
  trailColor = '#e0e0e0',
  textColor = '#6bdba7',
  strokeWidth = 8
}: CircularProgressbarProps) {
  const elapsed = total - remaining;

  return (
    <div className={clsx("h-[200px] w-[200px] font-bold", className)}>
      <BaseCircularProgressbar
        value={elapsed}
        maxValue={total}
        text={text}
        strokeWidth={strokeWidth}
        styles={buildStyles({
          pathColor,
          trailColor,
          textColor,
          strokeLinecap: 'round',
          textSize: '16px'
        })}
      />
    </div>
  );
}

export { CircularProgressbar };
