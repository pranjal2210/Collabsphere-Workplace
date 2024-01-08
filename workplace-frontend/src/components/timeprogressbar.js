import React from "react";
import '../styles/progressbar.css';
function Timeprogressbar(props) {
    // console.log(props.data.pauseResume);
    const pauseResumeData = props.data.pauseResume;
    return (
        <>
            <section>
                <ol className="progress-bar">
                    <li className="is-active"><span>{props.data.clockin}</span><span className="has-changes3"></span></li>
                    {pauseResumeData.map((data) => (
                        <>
                            {data.pause !== "00:00:00" ?
                                <>
                                    <li className="is-complete pause"><span style={{ color: "red" }}>{data.pause}</span><span className="has-changes"></span></li>
                                    <li className="is-complete resume"><span style={{ color: "blue" }}>{data.resume}</span><span className="has-changes2"></span></li>
                                </>
                                :
                                <>
                                </>
                            }
                        </>
                    ))}
                    <li className="is-active"><span>{props.data.clockout}</span><span className="has-changes4"></span></li>
                </ol>
            </section>
        </>
    );
}
export default Timeprogressbar;